import { json, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

export const deliveryStatusEnum = pgEnum("delivery_status", [
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
    "failed",
    "cancelled",
]);

export const productsTable = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    tagline: text('tagline').notNull(),
    price: numeric('price').notNull(),
    shades: json('shades').notNull(),
    rating: numeric('rating').notNull(),
    reviewCount: numeric('reviewCount').notNull(),
    stock: numeric('stock').notNull(),
    badge: text('badge').notNull(),
    description: text('description').notNull(),
    benefits: json('benefits').notNull(),
    ingredients: text('ingredients').notNull(),
    howToUse: text('howToUse').notNull(),
    categoryId: uuid('categoryId').notNull().references(() => categoriesTable.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});


export const categoriesTable = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const productImagesTable = pgTable('product_images', {
    id: uuid('id').primaryKey().defaultRandom(),
    imageName: text('imageName').notNull(),
    storageKey: text('storageKey').notNull(),
    mimeType: text('mimeType').notNull(),
    fileSize: text('fileSize').notNull(),
    productId: uuid('productId').references(() => productsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ordersTable = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: text('orderNumber').notNull(),
    customerId: uuid('customerId').notNull(),
    status: orderStatusEnum('status').notNull(),
    totalAmount: numeric('totalAmount').notNull(),
    deliveryFee: numeric('deliveryFee').notNull(),
    discount: numeric('discount').notNull(),
    paymentStatus: paymentStatusEnum('paymentStatus').notNull(),
    paymentMethod: text('paymentMethod').notNull(),
    deliveryAddress: json('deliveryAddress').notNull(),
    deliveryNotes: text('deliveryNotes'),
    paymentId: text('paymentId').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const orderItemsTable = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('productId').notNull().references(() => productsTable.id),
    orderId: uuid('orderId').notNull().references(() => ordersTable.id),
    quantity: numeric('quantity').notNull(),
    price: numeric('price').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const customersTable = pgTable('customers', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    totalOrders: numeric('totalOrders').notNull(),
    totalSpend: numeric('totalSpend').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const deliveriesTable = pgTable('deliveries', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('orderId').notNull().references(() => ordersTable.id),
    riderName: text('riderName').notNull(),
    riderPhone: text('riderPhone').notNull(),
    riderId: uuid('riderId').notNull(),
    trackingCode: text('trackingCode').notNull(),
    status: deliveryStatusEnum('status').notNull(),
    completedAt: timestamp('completedAt'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

export interface DbShade {
    name: string;
    hex: string;
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

