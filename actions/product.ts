'use server'

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { categoriesTable, productImagesTable, productsTable } from "@/lib/db/schema"
import {
  ProductFormState,
  ProductFormValues,
  ProductSchema,
  ProductShadeInput,
  UploadedProductImage,
} from "@/lib/schemas/product"

function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T | null {
  if (typeof value !== "string" || value.length === 0) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function normalizeShades(shades: ProductShadeInput[]) {
  const seen = new Set<string>()

  return shades.filter((shade) => {
    const normalizedName = shade.name.trim()
    const dedupeKey = normalizedName.toLowerCase()

    if (normalizedName.length === 0 || seen.has(dedupeKey)) {
      return false
    }

    seen.add(dedupeKey)
    shade.name = normalizedName
    shade.hex = shade.hex.trim().toLowerCase()
    return true
  })
}

function normalizeBenefits(benefits: string[]) {
  const seen = new Set<string>()

  return benefits.filter((benefit) => {
    const normalizedBenefit = benefit.trim()
    const dedupeKey = normalizedBenefit.toLowerCase()

    if (normalizedBenefit.length === 0 || seen.has(dedupeKey)) {
      return false
    }

    seen.add(dedupeKey)
    return true
  }).map((benefit) => benefit.trim())
}

export async function createProductAction(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const images = parseJsonField<UploadedProductImage[]>(formData.get("images"), [])
  const shades = parseJsonField<ProductShadeInput[]>(formData.get("shades"), [])
  const benefits = parseJsonField<string[]>(formData.get("benefits"), [])

  if (images === null || shades === null || benefits === null) {
    return {
      success: false,
      message: "One or more product details could not be read. Please review the form and try again.",
      values: prevState.values,
    }
  }

  const rawName = String(formData.get("name") ?? "")

  const rawData: ProductFormValues = {
    name: rawName,
    slug: String(formData.get("slug") ?? "") || slugifyProductName(rawName),
    tagline: String(formData.get("tagline") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    stock: String(formData.get("stock") ?? ""),
    shades,
    benefits,
    ingredients: String(formData.get("ingredients") ?? ""),
    howToUse: String(formData.get("howToUse") ?? ""),
    category: String(formData.get("category") ?? ""),
    status: formData.get("status") === "draft" ? "draft" : "active",
    badge: formData.get("badge") === "featured"
      ? "featured"
      : formData.get("badge") === "bestSeller"
        ? "bestSeller"
        : "none",
    images,
  }

  rawData.shades = normalizeShades(rawData.shades)
  rawData.benefits = normalizeBenefits(rawData.benefits)
  rawData.slug = slugifyProductName(rawData.slug || rawData.name)

  const validatedFields = ProductSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please verify your fields.",
      values: rawData,
    }
  }

  try {
    const data = validatedFields.data
    const [category] = await db
      .select({
        id: categoriesTable.id,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, data.category))
      .limit(1)

    if (!category) {
      return {
        success: false,
        errors: {
          category: ["Selected category was not found."],
        },
        message: "Choose a valid category before saving.",
        values: rawData,
      }
    }

    await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(productsTable)
        .values({
          slug: data.slug,
          name: data.name,
          tagline: data.tagline,
          price: String(data.price),
          shades: data.shades,
          rating: "0",
          reviewCount: "0",
          stock: String(data.stock),
          badge: data.status === "draft" ? "draft" : data.badge === "none" ? null : data.badge,
          description: data.description,
          benefits: data.benefits.length > 0 ? data.benefits : null,
          ingredients: data.ingredients ?? null,
          howToUse: data.howToUse ?? null,
          categoryId: category.id,
        })
        .returning({
          id: productsTable.id,
        })

      if (data.images.length > 0) {
        await tx.insert(productImagesTable).values(
          data.images.map((image) => ({
            imageName: image.imageName,
            mimeType: image.mimeType,
            fileSize: String(image.fileSize),
            storageKey: image.storageKey,
            productId: product.id,
          }))
        )
      }
    })

    revalidatePath("/admin/products")

    return {
      success: true,
      message: "Product created successfully!",
    }
  } catch (error) {
    console.error("Database insertion failed:", error)
    return {
      success: false,
      message: "Database insertion failed. Try again later.",
      values: rawData,
    }
  }
}
