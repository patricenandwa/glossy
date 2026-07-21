import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  customersTable,
  deliveriesTable,
  orderItemsTable,
  ordersTable,
  paymentsTable,
  productsTable,
  type DbShade,
} from "@/lib/db/schema";
import { getDeliveryLocationByCode } from "./logistics";

const checkoutItemSchema = z.object({
  productSlug: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
  shadeName: z.string().trim().min(1),
});

export const checkoutPayloadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(9).max(20),
  locationCode: z.string().trim().min(1),
  addressLine: z.string().trim().min(2).max(120),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  apartment: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["paystack", "cash_on_delivery"]),
  items: z.array(checkoutItemSchema).min(1),
});

type CheckoutInput = z.infer<typeof checkoutPayloadSchema>;
type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type CheckoutResult =
  | {
      ok: true;
      mode: "cash_on_delivery";
      orderNumber: string;
      total: number;
      deliveryFee: number;
    }
  | {
      ok: true;
      mode: "paystack";
      orderNumber: string;
      total: number;
      deliveryFee: number;
      paystack: {
        amountInKobo: number;
        reference: string;
        email: string;
        metadata: Record<string, string>;
      };
    };

export type PaystackVerificationPayload = {
  id?: number | string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  reference?: string | null;
  paid_at?: string | null;
  gateway_response?: string | null;
  metadata?: Record<string, unknown> | null;
};

type InventoryAdjustmentItem = {
  productId: string;
  productName: string;
  quantity: number;
};

function parseNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function normalizePhone(phone: string) {
  return phone.replace(/\D+/g, "");
}

function buildOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `GG-${stamp}${rand}`;
}

function buildTrackingCode(orderNumber: string) {
  return `DLV-${orderNumber.replace(/[^A-Z0-9]/gi, "")}`;
}

function buildPaystackReference(orderNumber: string) {
  return `gg_${orderNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Date.now()}`;
}

async function reserveInventory(tx: DbTransaction, items: InventoryAdjustmentItem[]) {
  for (const item of items) {
    const updatedProducts = await tx
      .update(productsTable)
      .set({
        stock: sql`${productsTable.stock} - ${String(item.quantity)}`,
      })
      .where(
        and(
          eq(productsTable.id, item.productId),
          sql`${productsTable.stock} >= ${String(item.quantity)}`,
        ),
      )
      .returning({
        id: productsTable.id,
      });

    if (updatedProducts.length === 0) {
      throw new Error(`${item.productName} does not have enough stock right now.`);
    }
  }
}

async function restoreInventory(tx: DbTransaction, items: InventoryAdjustmentItem[]) {
  for (const item of items) {
    await tx
      .update(productsTable)
      .set({
        stock: sql`${productsTable.stock} + ${String(item.quantity)}`,
      })
      .where(eq(productsTable.id, item.productId));
  }
}

function resolveCheckoutShade(shades: unknown[], requestedShadeName: string): DbShade | null {
  if (!Array.isArray(shades)) {
    return null;
  }

  const typedShades = shades.filter(
    (s: any): s is DbShade =>
      typeof s === "object" && s !== null && "name" in s && "hex" in s,
  );

  const foundShade = typedShades.find((s) => s.name === requestedShadeName);
  if (foundShade) {
    return foundShade;
  }

  if (requestedShadeName === "Signature" && typedShades.length > 0) {
    return typedShades[0];
  }

  return null;
}

export async function createCheckoutOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const location = getDeliveryLocationByCode(input.locationCode);

  if (!location) {
    throw new Error("Selected delivery location is not available.");
  }

  const slugs = [...new Set(input.items.map((item) => item.productSlug))];
  const products = await db
    .select({
      id: productsTable.id,
      slug: productsTable.slug,
      name: productsTable.name,
      price: productsTable.price,
      stock: productsTable.stock,
      shades: productsTable.shades,
    })
    .from(productsTable)
    .where(inArray(productsTable.slug, slugs));

  // Group all product rows by slug — each shade may be stored as a separate row
  const rowsBySlug = new Map<string, typeof products>();
  for (const product of products) {
    const existing = rowsBySlug.get(product.slug);
    if (existing) {
      existing.push(product);
    } else {
      rowsBySlug.set(product.slug, [product]);
    }
  }

  if (rowsBySlug.size !== slugs.length) {
    throw new Error("One or more products in your bag could not be found.");
  }

  const normalizedItems = input.items.map((item) => {
    const rows = rowsBySlug.get(item.productSlug);
    if (!rows || rows.length === 0) {
      throw new Error(`Product ${item.productSlug} was not found.`);
    }

    // Find the specific row that owns the requested shade
    let matchedRow: (typeof rows)[0] | null = null;
    let resolvedShade: DbShade | null = null;

    for (const row of rows) {
      const shades = Array.isArray(row.shades) ? row.shades : [];
      const shade = resolveCheckoutShade(shades, item.shadeName);
      if (shade) {
        matchedRow = row;
        resolvedShade = shade;
        break;
      }
    }

    if (!matchedRow || !resolvedShade) {
      throw new Error(`${rows[0].name} shade ${item.shadeName} is no longer available.`);
    }

    const stock = parseNumber(matchedRow.stock);
    if (item.quantity > stock) {
      throw new Error(`${matchedRow.name} does not have enough stock right now.`);
    }

    return {
      productId: matchedRow.id,
      productName: matchedRow.name,
      productSlug: matchedRow.slug,
      price: parseNumber(matchedRow.price),
      quantity: item.quantity,
      shade: resolvedShade,
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = location.fee;
  const total = subtotal + deliveryFee;
  const phoneNormalized = normalizePhone(input.phone);
  const orderNumber = buildOrderNumber();
  const paymentReference =
    input.paymentMethod === "paystack"
      ? buildPaystackReference(orderNumber)
      : `cod_${orderNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  await db.transaction(async (tx) => {
    const [existingCustomer] = await tx
      .select()
      .from(customersTable)
      .where(eq(customersTable.phoneNormalized, phoneNormalized))
      .limit(1);

    const customerValues = {
      email: input.email,
      name: input.name,
      phone: input.phone,
      phoneNormalized,
      totalOrders: String((existingCustomer ? parseNumber(existingCustomer.totalOrders) : 0) + 1),
      totalSpend: String((existingCustomer ? parseNumber(existingCustomer.totalSpend) : 0) + total),
    };

    const customerId = existingCustomer
      ? (
          await tx
            .update(customersTable)
            .set(customerValues)
            .where(eq(customersTable.id, existingCustomer.id))
            .returning({ id: customersTable.id })
        )[0].id
      : (
          await tx
            .insert(customersTable)
            .values(customerValues)
            .returning({ id: customersTable.id })
        )[0].id;

    const [order] = await tx
      .insert(ordersTable)
      .values({
        orderNumber,
        customerId,
        status: input.paymentMethod === "cash_on_delivery" ? "confirmed" : "pending",
        subtotalAmount: String(subtotal),
        totalAmount: String(total),
        deliveryFee: String(deliveryFee),
        discount: "0",
        paymentStatus: "pending",
        paymentMethod: input.paymentMethod,
        deliveryAddress: {
          locationCode: location.code,
          locationName: location.label,
          addressLine: input.addressLine,
          landmark: input.landmark || undefined,
          apartment: input.apartment || undefined,
        },
        deliveryNotes: input.notes || null,
      })
      .returning({
        id: ordersTable.id,
      });

    await reserveInventory(
      tx,
      normalizedItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
      })),
    );

    await tx.insert(paymentsTable).values({
      orderId: order.id,
      provider: input.paymentMethod === "paystack" ? "paystack" : "cash_on_delivery",
      reference: paymentReference,
      amount: String(total),
      currency: "KES",
      status: "pending",
      metadata: {
        orderNumber,
        customerPhone: input.phone,
      },
    });

    await tx.insert(orderItemsTable).values(
      normalizedItems.map((item) => ({
        productId: item.productId,
        orderId: order.id,
        quantity: String(item.quantity),
        price: String(item.price),
        shade: item.shade,
      })),
    );

    await tx.insert(deliveriesTable).values({
      orderId: order.id,
      providerName: "warehouse-placeholder",
      providerType: "internal_placeholder",
      trackingCode: buildTrackingCode(orderNumber),
      zoneCode: location.code,
      zoneLabel: location.label,
      quotedFee: String(deliveryFee),
      status: "pending",
      metadata: {
        eta: location.eta,
        integrationReady: true,
      },
    });
  });

  if (input.paymentMethod === "cash_on_delivery") {
    return {
      ok: true,
      mode: "cash_on_delivery",
      orderNumber,
      total,
      deliveryFee,
    };
  }

  return {
    ok: true,
    mode: "paystack",
    orderNumber,
    total,
    deliveryFee,
    paystack: {
      amountInKobo: Math.round(total * 100),
      reference: paymentReference,
      email: input.email,
      metadata: {
        orderNumber,
        customerName: input.name,
        customerPhone: input.phone,
      },
    },
  };
}

export async function markPaystackPaymentFailed(
  reference: string,
  payload?: PaystackVerificationPayload | null,
) {
  await db.transaction(async (tx) => {
    const [payment] = await tx
      .select({
        id: paymentsTable.id,
        orderId: paymentsTable.orderId,
        status: paymentsTable.status,
      })
      .from(paymentsTable)
      .where(eq(paymentsTable.reference, reference))
      .limit(1);

    if (!payment || payment.status === "paid" || payment.status === "failed") {
      return;
    }

    const orderItems = await tx
      .select({
        productId: orderItemsTable.productId,
        quantity: orderItemsTable.quantity,
        productName: productsTable.name,
      })
      .from(orderItemsTable)
      .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
      .where(eq(orderItemsTable.orderId, payment.orderId));

    await tx
      .update(paymentsTable)
      .set({
        status: "failed",
        metadata: payload ?? undefined,
      })
      .where(eq(paymentsTable.id, payment.id));

    await tx
      .update(ordersTable)
      .set({
        paymentStatus: "failed",
        status: "cancelled",
      })
      .where(eq(ordersTable.id, payment.orderId));

    await restoreInventory(
      tx,
      orderItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: parseNumber(item.quantity),
      })),
    );
  });
}

export async function markPaystackPaymentPaid(
  reference: string,
  payload: PaystackVerificationPayload,
) {
  return db.transaction(async (tx) => {
    const [payment] = await tx
      .select({
        id: paymentsTable.id,
        orderId: paymentsTable.orderId,
        amount: paymentsTable.amount,
        status: paymentsTable.status,
      })
      .from(paymentsTable)
      .where(and(eq(paymentsTable.reference, reference), eq(paymentsTable.provider, "paystack")))
      .limit(1);

    if (!payment) {
      throw new Error("Payment reference was not found.");
    }

    const expectedAmount = parseNumber(payment.amount);
    const paidAmount = typeof payload.amount === "number" ? payload.amount / 100 : 0;

    if (paidAmount > 0 && Math.abs(expectedAmount - paidAmount) > 0.01) {
      throw new Error("Paystack amount does not match the order total.");
    }

    const [order] = await tx
      .select({
        id: ordersTable.id,
        orderNumber: ordersTable.orderNumber,
        status: ordersTable.status,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, payment.orderId))
      .limit(1);

    if (!order) {
      throw new Error("Order for payment reference was not found.");
    }

    if (payment.status === "failed") {
      throw new Error("Payment was already marked as failed and the reserved stock was released.");
    }

    if (payment.status !== "paid") {
      await tx
        .update(paymentsTable)
        .set({
          status: "paid",
          providerTransactionId:
            payload.id === null || payload.id === undefined ? null : String(payload.id),
          paidAt: payload.paid_at ? new Date(payload.paid_at) : new Date(),
          metadata: payload.metadata ?? payload,
        })
        .where(eq(paymentsTable.id, payment.id));

      await tx
        .update(ordersTable)
        .set({
          paymentStatus: "paid",
          status: order.status === "pending" ? "confirmed" : order.status,
        })
        .where(eq(ordersTable.id, order.id));
    }

    return order.orderNumber;
  });
}

export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as {
    status?: boolean;
    data?: PaystackVerificationPayload;
    message?: string;
  };

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Unable to verify Paystack transaction.");
  }

  return payload.data;
}
