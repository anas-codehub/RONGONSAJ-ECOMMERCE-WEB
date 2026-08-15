import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  const unreadCount = orders.filter((o) => !o.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Orders
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} total orders
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>
      <AdminOrdersTable orders={orders as any} />
    </div>
  );
}
