import { fetchProducts } from "@/lib/api"
import { formatKsh } from "@/lib/format"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2 } from "lucide-react"

export default async function AdminProductsPage() {
  const products = await fetchProducts()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Products</h1>
          <p className="text-zinc-500">Manage your product catalog.</p>
        </div>
        <Button asChild className="bg-charcoal text-white hover:bg-charcoal/90">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-white ring-1 ring-black/[0.04]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="overflow-hidden rounded-md bg-muted">
                    <img
                      src={product.images?.[0]?.storageKey || "/placeholder.jpg"}
                      alt={product.name}
                      className="aspect-square h-12 w-12 object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-charcoal">{product.name}</TableCell>
                <TableCell>{formatKsh(typeof product.price === "string" ? parseFloat(product.price) : product.price)}</TableCell>
                <TableCell>
                  {typeof product.stock === "string" ? parseInt(product.stock, 10) : product.stock}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                    Active
                  </span>
                </TableCell>
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
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
