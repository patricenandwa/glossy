import { z } from "zod"

export const CategorySchema = z.object({
    name: z.string().min(1, "Category name is required.").trim(),
    slug: z.string().min(1, "Category slug is required.").trim(),
})

export type CategoryFormValues = {
    name: string;
    slug: string;
}

export const defaultCategoryFormValues: CategoryFormValues = {
    name: "",
    slug: "",
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string[]>>

export type CategoryFormState = {
    success?: boolean;
    message?: string;
    errors?: CategoryFormErrors;
    values?: CategoryFormValues;
}