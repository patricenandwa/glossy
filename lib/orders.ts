import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customersTable, deliveriesTable, orderItemsTable, ordersTable, productsTable } from "@/lib/db/schema";
import { normalizePhone } from "./checkout/server";

export type PublicOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "paystack" | "cash_on_delivery";
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    locationName: string;
    addressLine: string;
    landmark?: string;
    apartment?: string;
    trackingCode?: string;
    providerName?: string;
    eta?: string;
  };
  items: {
    productName: string;
    productSlug: string;
    quantity: number;
    price: number;
    shade: string;
  }[];
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

function parseDeliveryAddress(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return {
      locationName: "",
      addressLine: "",
    };
  }

  const address = value as Record<string, unknown>;

  return {
    locationName: typeof address.locationName === "string" ? address.locationName : "",
    addressLine: typeof address.addressLine === "string" ? address.addressLine : "",
    landmark: typeof address.landmark === "string" ? address.landmark : undefined,
    apartment: typeof address.apartment === "string" ? address.apartment : undefined,
  };
}

async function fetchOrderRecord(where: ReturnType<typeof eq> | ReturnType<typeof and>) {
  const [order] = await db
    .select({
      id: ordersTable.id,
      orderNumber: ordersTable.orderNumber,
      createdAt: ordersTable.createdAt,
      status: ordersTable.status,
      paymentStatus: ordersTable.paymentStatus,
      paymentMethod: ordersTable.paymentMethod,
      subtotalAmount: ordersTable.subtotalAmount,
      totalAmount: ordersTable.totalAmount,
      deliveryFee: ordersTable.deliveryFee,
      deliveryAddress: ordersTable.deliveryAddress,
      customerName: customersTable.name,
      customerEmail: customersTable.email,
      customerPhone: customersTable.phone,
      trackingCode: deliveriesTable.trackingCode,
      providerName: deliveriesTable.providerName,
      deliveryMetadata: deliveriesTable.metadata,
    })
    .from(ordersTable)
    .innerJoin(customersTable, eq(customersTable.id, ordersTable.customerId))
    .leftJoin(deliveriesTable, eq(deliveriesTable.orderId, ordersTable.id))
    .where(where)
    .limit(1);

  if (!order) {
    return null;
  }

  const items = await db
    .select({
      productName: productsTable.name,
      productSlug: productsTable.slug,
      quantity: orderItemsTable.quantity,
      price: orderItemsTable.price,
      shade: orderItemsTable.shade,
    })
    .from(orderItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, orderItemsTable.productId))
    .where(eq(orderItemsTable.orderId, order.id));

  const address = parseDeliveryAddress(order.deliveryAddress);
  const metadata =
    typeof order.deliveryMetadata === "object" && order.deliveryMetadata !== null
      ? (order.deliveryMetadata as Record<string, unknown>)
      : {};

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: parseNumber(order.subtotalAmount),
    deliveryFee: parseNumber(order.deliveryFee),
    total: parseNumber(order.totalAmount),
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    delivery: {
      locationName: address.locationName,
      addressLine: address.addressLine,
      landmark: address.landmark,
      apartment: address.apartment,
      trackingCode: order.trackingCode ?? undefined,
      providerName: order.providerName ?? undefined,
      eta: typeof metadata.eta === "string" ? metadata.eta : undefined,
    },
    items: items.map((item) => ({
      productName: item.productName,
      productSlug: item.productSlug,
      quantity: parseNumber(item.quantity),
      price: parseNumber(item.price),
      shade: item.shade.name,
    })),
  } satisfies PublicOrder;
}

export async function fetchPublicOrderByOrderNumber(orderNumber: string) {
  return fetchOrderRecord(eq(ordersTable.orderNumber, orderNumber));
}

export async function fetchTrackableOrder(orderNumber: string, phone: string) {
  return fetchOrderRecord(
    and(
      eq(ordersTable.orderNumber, orderNumber.trim().toUpperCase()),
      eq(customersTable.phoneNormalized, normalizePhone(phone)),
    ),
  );
}
