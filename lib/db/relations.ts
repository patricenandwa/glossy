import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  productsTable: {
    images: r.many.productImagesTable({
      from: r.productsTable.id,
      to: r.productImagesTable.productId,
    }),
    orderItems: r.many.orderItemsTable({
      from: r.productsTable.id,
      to: r.orderItemsTable.productId,
    }),
    category: r.one.categoriesTable({
      from: r.productsTable.categoryId,
      to: r.categoriesTable.id,
      optional: false,
    }),
  },
  categoriesTable: {
    products: r.many.productsTable({
      from: r.categoriesTable.id,
      to: r.productsTable.categoryId,
    }),
  },
  productImagesTable: {
    product: r.one.productsTable({
      from: r.productImagesTable.productId,
      to: r.productsTable.id,
      optional: false,
    }),
  },
  ordersTable: {
    orderItems: r.many.orderItemsTable({
      from: r.ordersTable.id,
      to: r.orderItemsTable.orderId,
    }),
    delivery: r.one.deliveriesTable({
      from: r.ordersTable.id,
      to: r.deliveriesTable.orderId,
    }),
  },
  orderItemsTable: {
    product: r.one.productsTable({
      from: r.orderItemsTable.productId,
      to: r.productsTable.id,
      optional: false,
    }),
    order: r.one.ordersTable({
      from: r.orderItemsTable.orderId,
      to: r.ordersTable.id,
      optional: false,
    }),
  },
  deliveriesTable: {
    order: r.one.ordersTable({
      from: r.deliveriesTable.orderId,
      to: r.ordersTable.id,
      optional: false,
    }),
  },
}));
