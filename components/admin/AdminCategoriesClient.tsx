"use client"

import * as React from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { createCategory, type AdminCategory } from "@/actions/category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { defaultCategoryFormValues } from "@/lib/schemas/category"

type AdminCategoriesClientProps = {
  categories: AdminCategory[]
}

function slugifyCategoryName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const [formValues, setFormValues] = React.useState(defaultCategoryFormValues)
  const [state, formAction, isPending] = React.useActionState(createCategory, {})

  React.useEffect(() => {
    if (!state.message) {
      return
    }

    if (state.success) {
      toast.success(state.message)
      setFormValues(defaultCategoryFormValues)
      return
    }

    toast.error(state.message)
  }, [state])

  const displayedValues = state.success ? formValues : { ...formValues, ...state.values }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormValues((prev) => {
      if (name === "name") {
        return {
          ...prev,
          name: value,
          slug: slugifyCategoryName(value),
        }
      }

      return {
        ...prev,
        slug: value,
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Categories</h1>
        <p className="text-zinc-500">Manage product categories.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="rounded-xl border bg-white ring-1 ring-black/[0.04]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium text-charcoal">{category.name}</TableCell>
                  <TableCell className="text-zinc-500">{category.slug}</TableCell>
                  <TableCell>{category.products}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-500 hover:text-charcoal">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-zinc-500">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-medium text-charcoal">Create Category</h2>
            <form action={formAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Matte Lipsticks"
                  disabled={isPending}
                  value={displayedValues.name}
                  onChange={handleInputChange}
                />
                {state.errors?.name && <p className="text-xs text-red-500">{state.errors.name[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="e.g. matte-lipsticks"
                  disabled={isPending}
                  value={displayedValues.slug}
                  onChange={handleInputChange}
                />
                {state.errors?.slug && <p className="text-xs text-red-500">{state.errors.slug[0]}</p>}
              </div>
              <Button type="submit" disabled={isPending} className="mt-2 bg-charcoal text-white hover:bg-charcoal/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
