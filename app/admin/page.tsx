import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react"
import { formatKsh } from "@/lib/format"
import { fetchAdminOverview } from "@/lib/api"

export default async function AdminOverview() {
  const overview = await fetchAdminOverview()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Overview</h1>
        <p className="text-zinc-500">Welcome to your dashboard. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{formatKsh(overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Based on all recorded orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{overview.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pending, confirmed, processing, or shipped
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Live rows in the products table
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">{overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Customer records in the database
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
