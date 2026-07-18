"use client"

import { NewProductPageClient } from "@/components/admin/NewProductPageClient"
import { CategoryOption } from "@/lib/api"

type NewProductFormProps = {
  categories: CategoryOption[]
}

export function NewProductForm({ categories }: NewProductFormProps) {
  return <NewProductPageClient categories={categories} />
}
