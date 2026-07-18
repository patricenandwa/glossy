"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createProductAction } from "@/actions/product"
import { CloudflareImageUploader } from "@/components/admin/CloudflareImageUploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CategoryOption } from "@/lib/api"
import {
  ProductFormErrors,
  ProductSchema,
  ProductShadeInput,
  UploadedProductImage,
  defaultProductFormValues,
} from "@/lib/schemas/product"

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

type NewProductPageClientProps = {
  categories: CategoryOption[]
}

export function NewProductPageClient({ categories }: NewProductPageClientProps) {
  const [formValues, setFormValues] = React.useState(defaultProductFormValues)
  const [hasRestoredDraft, setHasRestoredDraft] = React.useState(false)

  const [state, formAction, isPending] = React.useActionState(createProductAction, {})
  const clientErrors = getClientErrors(formValues)
  const displayedErrors = { ...state.errors, ...clientErrors }
  const hasClientErrors = Object.keys(clientErrors).length > 0

  React.useEffect(() => {
    if (categories.length === 0) {
      return
    }

    setFormValues((prev) => {
      const hasMatchingCategory = categories.some((category) => category.slug === prev.category)

      if (hasMatchingCategory) {
        return prev
      }

      return {
        ...prev,
        category: categories[0].slug,
      }
    })
  }, [categories])

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
      setFormValues((prev) => ({
        ...defaultProductFormValues,
        category: categories.find((category) => category.slug === prev.category)?.slug
          ?? categories[0]?.slug
          ?? defaultProductFormValues.category,
      }))
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

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const updateShade = (index: number, field: keyof ProductShadeInput, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      shades: prev.shades.map((shade, shadeIndex) =>
        shadeIndex === index ? { ...shade, [field]: value } : shade
      ),
    }))
  }

  const addShade = () => {
    setFormValues((prev) => ({
      ...prev,
      shades: [...prev.shades, { name: "", hex: "#d7b49e" }],
    }))
  }

  const removeShade = (indexToRemove: number) => {
    setFormValues((prev) => ({
      ...prev,
      shades: prev.shades.filter((_, index) => index !== indexToRemove),
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      benefits: prev.benefits.map((benefit, benefitIndex) => (benefitIndex === index ? value : benefit)),
    }))
  }

  const addBenefit = () => {
    setFormValues((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }))
  }

  const removeBenefit = (indexToRemove: number) => {
    setFormValues((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (hasClientErrors) {
      event.preventDefault()
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-500" disabled={isPending}>
          <Link href="/admin/products">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Add Product</h1>
          <p className="text-zinc-500">Create a robust product entry with shades, benefits, and usage details.</p>
        </div>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-[1fr_320px]">
        <input type="hidden" id="slug" name="slug" value={formValues.slug} />
        <input type="hidden" name="shades" value={JSON.stringify(formValues.shades)} />
        <input type="hidden" name="benefits" value={JSON.stringify(formValues.benefits)} />
        <input type="hidden" name="images" value={JSON.stringify(formValues.images)} />

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

              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input
                  id="tagline"
                  name="tagline"
                  placeholder="e.g. The everyday nude"
                  disabled={isPending}
                  value={formValues.tagline}
                  onChange={handleInputChange}
                />
                {displayedErrors.tagline && <p className="text-xs text-red-500">{displayedErrors.tagline[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed product description..."
                  disabled={isPending}
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-y"
                />
                {displayedErrors.description && <p className="text-xs text-red-500">{displayedErrors.description[0]}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-medium text-charcoal">Shades</h2>
                <p className="text-sm text-zinc-500">Add every selectable shade with a display name and hex color.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addShade} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Add shade
              </Button>
            </div>
            <div className="grid gap-4">
              {formValues.shades.map((shade, index) => (
                <div key={`shade-${index}`} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_140px_auto]">
                  <div className="grid gap-2">
                    <Label htmlFor={`shade-name-${index}`}>Shade name</Label>
                    <Input
                      id={`shade-name-${index}`}
                      value={shade.name}
                      disabled={isPending}
                      placeholder="e.g. Barely There"
                      onChange={(event) => updateShade(index, "name", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`shade-hex-${index}`}>Hex color</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`shade-hex-${index}`}
                        type="color"
                        value={shade.hex}
                        disabled={isPending}
                        className="h-10 w-14 p-1"
                        onChange={(event) => updateShade(index, "hex", event.target.value)}
                      />
                      <Input
                        value={shade.hex}
                        disabled={isPending}
                        placeholder="#d7b49e"
                        onChange={(event) => updateShade(index, "hex", event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isPending || formValues.shades.length === 1}
                      onClick={() => removeShade(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {displayedErrors.shades && <p className="text-xs text-red-500">{displayedErrors.shades[0]}</p>}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-medium text-charcoal">Benefits</h2>
                <p className="text-sm text-zinc-500">Keep each benefit short so it reads well on product cards and details.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addBenefit} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Add benefit
              </Button>
            </div>
            <div className="grid gap-3">
              {formValues.benefits.map((benefit, index) => (
                <div key={`benefit-${index}`} className="flex gap-3">
                  <Input
                    value={benefit}
                    disabled={isPending}
                    placeholder="e.g. Non-sticky, cushioned wear"
                    onChange={(event) => updateBenefit(index, event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending || formValues.benefits.length === 1}
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {displayedErrors.benefits && <p className="text-xs text-red-500">{displayedErrors.benefits[0]}</p>}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Formula Details</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ingredients">Ingredients *</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  placeholder="List the main ingredients..."
                  disabled={isPending}
                  value={formValues.ingredients}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-y"
                />
                {displayedErrors.ingredients && <p className="text-xs text-red-500">{displayedErrors.ingredients[0]}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="howToUse">How To Use *</Label>
                <Textarea
                  id="howToUse"
                  name="howToUse"
                  placeholder="Explain how the customer should apply it..."
                  disabled={isPending}
                  value={formValues.howToUse}
                  onChange={handleInputChange}
                  className="min-h-[120px] resize-y"
                />
                {displayedErrors.howToUse && <p className="text-xs text-red-500">{displayedErrors.howToUse[0]}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Media</h2>
            {displayedErrors.images && <p className="mb-2 text-xs text-red-500">{displayedErrors.images[0]}</p>}

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
                  disabled={isPending}
                  value={formValues.category}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {displayedErrors.category && <p className="text-xs text-red-500">{displayedErrors.category[0]}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Publishing</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
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

              <div className="grid gap-2">
                <Label htmlFor="badge">Homepage badge</Label>
                <select
                  id="badge"
                  name="badge"
                  disabled={isPending || formValues.status === "draft"}
                  value={formValues.badge}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="none">No badge</option>
                  <option value="featured">Featured</option>
                  <option value="bestSeller">Best Seller</option>
                </select>
                <p className="text-xs text-zinc-500">
                  Draft products are saved with a draft badge and won&apos;t use the homepage badge above.
                </p>
              </div>
            </div>
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
