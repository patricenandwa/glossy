import { z } from "zod"

const optionalTrimmedString = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value
    const trimmed = value.trim()
    return trimmed === "" ? undefined : trimmed
  },
  z.string().optional()
)

const requiredTrimmedString = (message: string) =>
  z.string().trim().min(1, message)

const requiredNumber = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.coerce.number({ error: "Valid product price is required." }).min(0, "Price cannot be negative.")
)

const stockNumber = z.preprocess(
  (value) => (value === "" || value == null ? 0 : value),
  z.coerce.number().min(0, "Stock cannot be negative.")
)

const shadeSchema = z.object({
  name: requiredTrimmedString("Shade name is required."),
  hex: z.string().trim().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Enter a valid hex color."),
})

const benefitSchema = requiredTrimmedString("Benefit cannot be empty.")

export const ProductSchema = z.object({
  images: z.array(z.object({
    publicUrl: z.string().url(),
    storageKey: z.string().min(1, "Storage key is required."),
    imageName: z.string().min(1, "Image name is required."),
    mimeType: z.string().min(1, "Image type is required."),
    fileSize: z.number().int().positive("Image size must be greater than zero."),
  })).min(1, "At least one product image is required."),
  name: requiredTrimmedString("Product name is required."),
  slug: requiredTrimmedString("Product slug is required."),
  tagline: requiredTrimmedString("Tagline is required."),
  description: requiredTrimmedString("Description is required."),
  price: requiredNumber,
  stock: stockNumber,
  shades: z.array(shadeSchema).min(1, "Add at least one shade."),
  benefits: z.array(benefitSchema),
  ingredients: optionalTrimmedString,
  howToUse: optionalTrimmedString,
  category: z.string().min(1, "Category is required."),
  status: z.enum(["active", "draft"]),
  badge: z.enum(["none", "featured", "bestSeller"]).default("none"),
})

export type UploadedProductImage = z.infer<typeof ProductSchema.shape.images.element>
export type ProductShadeInput = z.infer<typeof shadeSchema>

export type ProductFormValues = {
  name: string
  slug: string
  tagline: string
  description: string
  price: string
  stock: string
  shades: ProductShadeInput[]
  benefits: string[]
  ingredients: string
  howToUse: string
  category: string
  status: "active" | "draft"
  badge: "none" | "featured" | "bestSeller"
  images: UploadedProductImage[]
}

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  price: "",
  stock: "0",
  shades: [{ name: "", hex: "#d7b49e" }],
  benefits: [],
  ingredients: "",
  howToUse: "",
  category: "lip-gloss",
  status: "active",
  badge: "none",
  images: [],
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string[]>>

export type ProductFormState = {
  success?: boolean
  message?: string
  errors?: ProductFormErrors
  values?: ProductFormValues
}
