import { and, desc, eq, inArray, ne } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  APIProductResponse,
  categoriesTable,
  customersTable,
  orderStatusEnum,
  ordersTable,
  productImagesTable,
  productsTable,
} from "@/lib/db/schema"
import { getPublicUrlForKey } from "@/lib/r2/r2"

type ProductRow = typeof productsTable.$inferSelect
type ProductImageRow = typeof productImagesTable.$inferSelect
type CategoryRow = typeof categoriesTable.$inferSelect
type CustomerRow = typeof customersTable.$inferSelect
type OrderRow = typeof ordersTable.$inferSelect

export type CategoryOption = {
  id: string
  name: string
  slug: string
}

export type AdminOverviewData = {
  totalRevenue: number
  activeOrders: number
  totalProducts: number
  totalCustomers: number
}

export type AdminOrderListItem = {
  id: string
  orderNumber: string
  customer: string
  amount: number
  status: (typeof orderStatusEnum.enumValues)[number]
  date: string
}

export type AdminCustomerListItem = {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpend: number
  joinDate: string
}

function parseNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function parseStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === "string")
}

function parseShades(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(
      (item): item is { name: string; hex: string } =>
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        "hex" in item &&
        typeof item.name === "string" &&
        typeof item.hex === "string"
    )
}

function mapProductToResponse(product: ProductRow, images: ProductImageRow[]): APIProductResponse {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    price: parseNumber(product.price),
    shades: parseShades(product.shades),
    rating: parseNumber(product.rating),
    reviewCount: parseNumber(product.reviewCount),
    stock: parseNumber(product.stock),
    badge: product.badge,
    description: product.description,
    benefits: parseStringArray(product.benefits),
    ingredients: product.ingredients,
    howToUse: product.howToUse,
    categoryId: product.categoryId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    images: images.map((image) => ({
      id: image.id,
      imageName: image.imageName,
      storageKey: getPublicUrlForKey(image.storageKey),
      mimeType: image.mimeType,
      fileSize: image.fileSize,
      productId: image.productId ?? product.id,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    })),
  }
}

async function fetchImagesByProductIds(productIds: string[]) {
  if (productIds.length === 0) {
    return new Map<string, ProductImageRow[]>()
  }

  const images = await db
    .select()
    .from(productImagesTable)
    .where(inArray(productImagesTable.productId, productIds))
    .orderBy(productImagesTable.createdAt)

  const imagesByProductId = new Map<string, ProductImageRow[]>()

  for (const image of images) {
    if (!image.productId) {
      continue
    }

    const existing = imagesByProductId.get(image.productId) ?? []
    existing.push(image)
    imagesByProductId.set(image.productId, existing)
  }

  return imagesByProductId
}

async function fetchMappedProducts(products: ProductRow[]) {
  const imagesByProductId = await fetchImagesByProductIds(products.map((product) => product.id))

  return products.map((product) => mapProductToResponse(product, imagesByProductId.get(product.id) ?? []))
}

export async function fetchProducts(): Promise<APIProductResponse[]> {
  const products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt))
  console.log(products);
  return fetchMappedProducts(products)
}

export async function fetchProductBySlug(slug: string): Promise<APIProductResponse | null> {
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, slug))
    .limit(1)

  if (!product) {
    return null
  }

  const imagesByProductId = await fetchImagesByProductIds([product.id])
  return mapProductToResponse(product, imagesByProductId.get(product.id) ?? [])
}

export async function fetchFeaturedProducts(): Promise<APIProductResponse[]> {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.badge, "featured"))
    .orderBy(desc(productsTable.createdAt))

  return fetchMappedProducts(products)
}

export async function fetchBestSellers(): Promise<APIProductResponse[]> {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.badge, "bestSeller"))
    .orderBy(desc(productsTable.createdAt))

  return fetchMappedProducts(products)
}

export async function fetchRelatedProducts(slug: string, count = 4): Promise<APIProductResponse[]> {
  const products = await db
    .select()
    .from(productsTable)
    .where(ne(productsTable.slug, slug))
    .orderBy(desc(productsTable.createdAt))
    .limit(count)

  return fetchMappedProducts(products)
}

export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
    })
    .from(categoriesTable)
    .orderBy(categoriesTable.name)

  return categories
}

export async function fetchAdminOverview(): Promise<AdminOverviewData> {
  const [orders, products, customers] = await Promise.all([
    db.select().from(ordersTable),
    db.select({ id: productsTable.id }).from(productsTable),
    db.select({ id: customersTable.id }).from(customersTable),
  ])

  return {
    totalRevenue: orders.reduce((sum, order) => sum + parseNumber(order.totalAmount), 0),
    activeOrders: orders.filter((order) => order.status !== "delivered" && order.status !== "cancelled").length,
    totalProducts: products.length,
    totalCustomers: customers.length,
  }
}

export async function fetchAdminOrders(): Promise<AdminOrderListItem[]> {
  const ordersWithCustomers = await db
    .select({
      id: ordersTable.id,
      orderNumber: ordersTable.orderNumber,
      totalAmount: ordersTable.totalAmount,
      status: ordersTable.status,
      createdAt: ordersTable.createdAt,
      customerName: customersTable.name,
    })
    .from(ordersTable)
    .leftJoin(customersTable, eq(customersTable.id, ordersTable.customerId))
    .orderBy(desc(ordersTable.createdAt))

  return ordersWithCustomers.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.customerName ?? "Unknown customer",
    amount: parseNumber(order.totalAmount),
    status: order.status,
    date: order.createdAt.toISOString().slice(0, 10),
  }))
}

export async function fetchAdminCustomers(): Promise<AdminCustomerListItem[]> {
  const customers = await db
    .select()
    .from(customersTable)
    .orderBy(desc(customersTable.createdAt))

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    totalOrders: parseNumber(customer.totalOrders),
    totalSpend: parseNumber(customer.totalSpend),
    joinDate: customer.createdAt.toISOString().slice(0, 10),
  }))
}
