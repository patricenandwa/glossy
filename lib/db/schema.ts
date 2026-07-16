import {
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "paystack",
  "cash_on_delivery",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "failed",
  "cancelled",
]);

export const productsTable = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  price: numeric("price").notNull(),
  shades: jsonb("shades").notNull(),
  rating: numeric("rating").notNull(),
  reviewCount: numeric("reviewCount").notNull(),
  stock: numeric("stock").notNull(),
  badge: text("badge").notNull(),
  description: text("description").notNull(),
  benefits: jsonb("benefits").notNull(),
  ingredients: text("ingredients").notNull(),
  howToUse: text("howToUse").notNull(),
  categoryId: uuid("categoryId").notNull().references(() => categoriesTable.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const productImagesTable = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  imageName: text("imageName").notNull(),
  storageKey: text("storageKey").notNull(),
  mimeType: text("mimeType").notNull(),
  fileSize: text("fileSize").notNull(),
  productId: uuid("productId").references(() => productsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const customersTable = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    phoneNormalized: text("phoneNormalized").notNull(),
    totalOrders: numeric("totalOrders").notNull().default("0"),
    totalSpend: numeric("totalSpend").notNull().default("0"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    phoneNormalizedIdx: index("customers_phone_normalized_idx").on(table.phoneNormalized),
  }),
);

export const ordersTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("orderNumber").notNull(),
    customerId: uuid("customerId").notNull().references(() => customersTable.id),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotalAmount: numeric("subtotalAmount").notNull(),
    totalAmount: numeric("totalAmount").notNull(),
    deliveryFee: numeric("deliveryFee").notNull().default("0"),
    discount: numeric("discount").notNull().default("0"),
    paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("pending"),
    paymentMethod: paymentMethodEnum("paymentMethod").notNull(),
    currency: text("currency").notNull().default("KES"),
    deliveryAddress: jsonb("deliveryAddress").notNull(),
    deliveryNotes: text("deliveryNotes"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    orderNumberIdx: uniqueIndex("orders_order_number_idx").on(table.orderNumber),
  }),
);

export const paymentsTable = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("orderId").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerTransactionId: text("providerTransactionId"),
    reference: text("reference").notNull(),
    amount: numeric("amount").notNull(),
    currency: text("currency").notNull().default("KES"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    paidAt: timestamp("paidAt"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => ({
    referenceIdx: uniqueIndex("payments_reference_idx").on(table.reference),
  }),
);

export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("productId").notNull().references(() => productsTable.id),
  orderId: uuid("orderId").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  quantity: numeric("quantity").notNull(),
  price: numeric("price").notNull(),
  shade: jsonb("shade").$type<DbShade>().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const deliveriesTable = pgTable("deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("orderId").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  providerName: text("providerName").notNull().default("warehouse-placeholder"),
  providerType: text("providerType").notNull().default("internal_placeholder"),
  providerReference: text("providerReference"),
  trackingCode: text("trackingCode").notNull(),
  zoneCode: text("zoneCode").notNull(),
  zoneLabel: text("zoneLabel").notNull(),
  quotedFee: numeric("quotedFee").notNull(),
  riderName: text("riderName"),
  riderPhone: text("riderPhone"),
  riderId: uuid("riderId"),
  status: deliveryStatusEnum("status").notNull().default("pending"),
  metadata: jsonb("metadata"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date()),
});

export interface DbShade {
  name: string;
  hex: string;
}

export interface DeliveryAddress {
  locationCode: string;
  locationName: string;
  addressLine: string;
  landmark?: string;
  apartment?: string;
}

export interface APIProductResponse {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  shades: DbShade[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge: string;
  description: string;
  benefits: string[];
  ingredients: string;
  howToUse: string;
  categoryId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  images: {
    id: string;
    imageName: string;
    storageKey: string;
    mimeType: string;
    fileSize: string;
    productId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }[];
}
