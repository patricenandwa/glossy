// src/app/actions/product.ts
'use server'

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { categoriesTable, productImagesTable, productsTable } from "@/lib/db/schema"
import { ProductSchema, ProductFormState, ProductFormValues, UploadedProductImage } from "@/lib/schemas/product"

export async function createProductAction(
    prevState: ProductFormState,
    formData: FormData
): Promise<ProductFormState> {
    const imagesRaw = formData.get("images")
    let images: UploadedProductImage[] = []

    if (typeof imagesRaw === "string" && imagesRaw.length > 0) {
        try {
            images = JSON.parse(imagesRaw) as UploadedProductImage[]
        } catch {
            return {
                success: false,
                message: "Uploaded images could not be read. Please upload them again.",
            }
        }
    }

    const rawData: ProductFormValues = {
        name: String(formData.get("name") ?? ""),
        slug: String(formData.get("slug") ?? ""),
        tagline: String(formData.get("tagline") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: String(formData.get("price") ?? ""),
        stock: String(formData.get("stock") ?? ""),
        category: String(formData.get("category") ?? ""),
        status: formData.get("status") === "draft" ? "draft" : "active",
        images: images,
    }

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
                    tagline: data.tagline ?? "",
                    price: String(data.price),
                    shades: [],
                    rating: "0",
                    reviewCount: "0",
                    stock: String(data.stock),
                    badge: data.status === "draft" ? "draft" : "",
                    description: data.description ?? "",
                    benefits: [],
                    ingredients: "",
                    howToUse: "",
                    categoryId: category.id,
                })
                .returning({
                    id: productsTable.id,
                })

            await tx
                .insert(productImagesTable)
                .values(
                    data.images.map((image) => ({
                        imageName: image.imageName,
                        mimeType: image.mimeType,
                        fileSize: String(image.fileSize),
                        storageKey: image.storageKey,
                        productId: product.id,
                    }))
                )
        })

        revalidatePath("/admin/products")

        return {
            success: true,
            message: "Product created successfully!"
        }
    } catch (error) {
        console.error("Database insertion failed:", error)
        return {
            success: false,
            message: "Database insertion failed. Try again later."
        }
    }
}
