"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createProductAction } from "@/actions/product"
import { CloudflareImageUploader } from "@/components/admin/CloudflareImageUploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductFormErrors, ProductSchema, UploadedProductImage, defaultProductFormValues } from "@/lib/schemas/product"
import { AdminCategory } from "@/actions/category"

const PRODUCT_DRAFT_STORAGE_KEY = "admin-new-product-draft"
const PRODUCT_DRAFT_TTL_MS = 1000 * 60 * 60 * 2

function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function getClientErrors(values: typeof defaultProductFormValues): ProductFormErrors {
  const parsed = ProductSchema.safeParse(values)
  return parsed.success ? {} : parsed.error.flatten().fieldErrors
}

interface NewProductFormProps {
    categories: AdminCategory[];
}

export function NewProductForm({ categories }: NewProductFormProps) {
  const [formValues, setFormValues] = React.useState(() => {
    const initialValues = { ...defaultProductFormValues };
    if (categories.length > 0) {
      initialValues.category = categories[0].slug;
    }
    return initialValues;
  });
  const [hasRestoredDraft, setHasRestoredDraft] = React.useState(false)

  const [state, formAction, isPending] = React.useActionState(createProductAction, {})
  const clientErrors = getClientErrors(formValues)
  const displayedErrors = { ...state.errors, ...clientErrors }
  const hasClientErrors = Object.keys(clientErrors).length > 0

  React.useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(PRODUCT_DRAFT_STORAGE_KEY)

      if (!rawDraft) {
        setHasRestoredDraft(true)
        return
      }

      const parsedDraft = JSON.parse(rawDraft) as {
        savedAt?: number
        values?: typeof defaultProductFormValues
      }

      if (
        !parsedDraft.savedAt ||
        !parsedDraft.values ||
        Date.now() - parsedDraft.savedAt > PRODUCT_DRAFT_TTL_MS
      ) {
        window.localStorage.removeItem(PRODUCT_DRAFT_STORAGE_KEY)
        setHasRestoredDraft(true)
        return
      }

      setFormValues(parsedDraft.values)
      toast.info("Restored your in-progress product draft.")
    } catch {
      window.localStorage.removeItem(PRODUCT_DRAFT_STORAGE_KEY)
    } finally {
      setHasRestoredDraft(true)
    }
  }, [])

  React.useEffect(() => {
    if (!hasRestoredDraft) {
      return
    }

    window.localStorage.setItem(
      PRODUCT_DRAFT_STORAGE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        values: formValues,
      })
    )
  }, [formValues, hasRestoredDraft])

  React.useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      const initialValues = { ...defaultProductFormValues };
      if (categories.length > 0) {
        initialValues.category = categories[0].slug;
      }
      setFormValues(initialValues)
      window.localStorage.removeItem(PRODUCT_DRAFT_STORAGE_KEY)
      return
    }

    toast.error(state.message)
  }, [state, categories])

  const handleImageUpload = (image: UploadedProductImage) => {
    setFormValues((prev) => ({ ...prev, images: [...prev.images, image] }))
    toast.success("Image uploaded to Cloudflare successfully")
  }

  const handleImageRemove = (indexToRemove: number) => {
    setFormValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormValues((prev) => {
      if (name === "name") {
        return {
          ...prev,
          name: value,
          slug: slugifyProductName(value),
        }
      }

      if (name === "status") {
        return {
          ...prev,
          status: value === "draft" ? "draft" : "active",
        }
      }

      if (name === "category") {
        return {
          ...prev,
          category: value,
        }
      }

      if (name === "tagline") {
        return {
          ...prev,
          tagline: value,
        }
      }

      if (name === "description") {
        return {
          ...prev,
          description: value,
        }
      }

      if (name === "price") {
        return {
          ...prev,
          price: value,
        }
      }

      return {
        ...prev,
        stock: value,
      }
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (hasClientErrors) {
      event.preventDefault()
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-500" disabled={isPending}>
          <Link href="/admin/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Add Product</h1>
          <p className="text-zinc-500">Create a new product in your catalog.</p>
        </div>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">General Information</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Silk Glaze"
                  disabled={isPending}
                  value={formValues.name}
                  onChange={handleInputChange}
                />
                {displayedErrors.name && <p className="text-xs text-red-500">{displayedErrors.name[0]}</p>}
              </div>

              <input type="hidden" id="slug" name="slug" value={formValues.slug} />

              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  placeholder="e.g. The everyday nude"
                  disabled={isPending}
                  value={formValues.tagline}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed product description..."
                  disabled={isPending}
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-y"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Media</h2>
            {displayedErrors.images && <p className="mb-2 text-xs text-red-500">{displayedErrors.images[0]}</p>}

            <input type="hidden" name="images" value={JSON.stringify(formValues.images)} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formValues.images.map((img, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-xl border bg-muted">
                  <img src={img.publicUrl} alt={img.imageName || `Product view ${idx + 1}`} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleImageRemove(idx)}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-zinc-600 shadow-sm opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <CloudflareImageUploader
                onUploadSuccess={handleImageUpload}
                onRemove={() => {}}
                disabled={isPending}
                className={formValues.images.length > 0 ? "aspect-square h-full p-4" : "col-span-full"}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Pricing & Inventory</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (Ksh) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="1500"
                  disabled={isPending}
                  required
                  value={formValues.price}
                  onChange={handleInputChange}
                />
                {displayedErrors.price && <p className="text-xs text-red-500">{displayedErrors.price[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>

                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  disabled={isPending}
                  value={formValues.stock}
                  onChange={handleInputChange}
                />
                {displayedErrors.stock && <p className="text-xs text-red-500">{displayedErrors.stock[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  disabled={isPending || categories.length === 0}
                  value={formValues.category}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {displayedErrors.category && <p className="text-xs text-red-500">{displayedErrors.category[0]}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Status</h2>
            <select
              name="status"
              disabled={isPending}
              value={formValues.status}
              onChange={handleInputChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isPending || hasClientErrors}
            className="w-full bg-charcoal text-white hover:bg-charcoal/90"
          >
            {isPending ? "Saving Product..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
