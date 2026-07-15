import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatKsh } from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchAdminOrders } from "@/lib/api"

export default async function AdminOrdersPage() {
  const orders = await fetchAdminOrders()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Orders</h1>
        <p className="text-zinc-500">View and manage customer orders.</p>
      </div>

      <div className="rounded-xl border bg-white ring-1 ring-black/[0.04]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-charcoal">#{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-zinc-500">{order.date}</TableCell>
                <TableCell>{formatKsh(order.amount)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                    order.status === 'processing' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                    'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-500 hover:text-charcoal">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
