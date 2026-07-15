import { fetchCategoryOptions } from "@/lib/api"
import { NewProductPageClient } from "@/components/admin/NewProductPageClient"

export default async function NewProductPage() {
  const categories = await fetchCategoryOptions()

  return <NewProductPageClient categories={categories} />
}
