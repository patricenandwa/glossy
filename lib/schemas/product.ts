import { z } from "zod"

const optionalTrimmedString = z.preprocess(
    (value) => {
        if (typeof value !== "string") return value
        const trimmed = value.trim()
        return trimmed === "" ? undefined : trimmed
    },
    z.string().optional()
)

const requiredNumber = z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number({ error: "Valid product price is required." }).min(0, "Price cannot be negative.")
)

const stockNumber = z.preprocess(
    (value) => (value === "" || value == null ? 0 : value),
    z.coerce.number().min(0, "Stock cannot be negative.")
)

export const ProductSchema = z.object({
    images: z.array(z.object({
        publicUrl: z.string().url(),
        storageKey: z.string().min(1, "Storage key is required."),
        imageName: z.string().min(1, "Image name is required."),
        mimeType: z.string().min(1, "Image type is required."),
        fileSize: z.number().int().positive("Image size must be greater than zero."),
    })).min(1, "At least one product image is required."),
    name: z.string().min(1, "Product name is required.").trim(),
    slug: z.string().min(1, "Product slug is required.").trim(),
    tagline: optionalTrimmedString,
    description: optionalTrimmedString,
    price: requiredNumber,
    stock: stockNumber,
    category: z.string().min(1, "Category is required."),
    status: z.enum(["active", "draft"]),
})

export type UploadedProductImage = z.infer<typeof ProductSchema.shape.images.element>

export type ProductFormValues = {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    status: "active" | "draft";
    images: UploadedProductImage[];
}

export const defaultProductFormValues: ProductFormValues = {
    name: "",
    slug: "",
    tagline: "",
    description: "",
    price: "",
    stock: "0",
    category: "lip-gloss",
    status: "active",
    images: [],
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string[]>>

export type ProductFormState = {
    success?: boolean;
    message?: string;
    errors?: ProductFormErrors;
    values?: ProductFormValues;
}
