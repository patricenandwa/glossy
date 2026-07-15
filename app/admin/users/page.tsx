import { formatKsh } from "@/lib/format"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchAdminCustomers } from "@/lib/api"

export default async function AdminUsersPage() {
  const users = await fetchAdminCustomers()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-charcoal">Users</h1>
        <p className="text-zinc-500">Manage customer accounts and view their history.</p>
      </div>

      <div className="rounded-xl border bg-white ring-1 ring-black/[0.04]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead className="text-right">Total Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-charcoal">{user.name}</TableCell>
                <TableCell className="text-zinc-500">{user.email}</TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.totalOrders}</TableCell>
                <TableCell className="text-right tabular-nums">{formatKsh(user.totalSpend)}</TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
