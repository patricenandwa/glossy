import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient"
import { getCategories } from "@/actions/category"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return <AdminCategoriesClient categories={categories} />
}
