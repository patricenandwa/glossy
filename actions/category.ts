'use server'

import { db } from "@/lib/db"
import { categoriesTable, productsTable } from "@/lib/db/schema"
import { CategorySchema, CategoryFormState, CategoryFormValues } from "@/lib/schemas/category"
import { revalidatePath } from "next/cache"
import { count, eq } from "drizzle-orm"

export type AdminCategory = {
    id: string
    name: string
    slug: string
    products: number
}

export async function getCategories() {
    try {
        const categories = await db
            .select({
                id: categoriesTable.id,
                name: categoriesTable.name,
                slug: categoriesTable.slug,
                products: count(productsTable.id),
            })
            .from(categoriesTable)
            .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
            .groupBy(
                categoriesTable.id,
                categoriesTable.name,
                categoriesTable.slug,
            )
        return categories.map((category) => ({
            ...category,
            products: Number(category.products),
        }))
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function createCategory(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
    try {
        const name = formData.get("name") as string
        const slug = formData.get("slug") as string

        const rawData: CategoryFormValues = {
            name,
            slug,
        }

        const validatedFields = CategorySchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Please verify your fields.",
                values: rawData,
            }
        }

        const data = validatedFields.data
        await db
            .insert(categoriesTable)
            .values(data)
            .execute()
        revalidatePath("/admin/categories")
        return { success: true, message: "Category created successfully!", values: data }
    } catch (error) {
        console.error("Error creating category:", error)
        return { success: false, message: "Failed to create category" }
    }
}
