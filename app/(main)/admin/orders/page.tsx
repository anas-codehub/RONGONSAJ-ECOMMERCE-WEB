import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import { ShoppingBag } from "lucide-react";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const orders = await db.order.findMany({
    include: {
      user: true,
      address: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length} orders total
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-foreground font-bold">No orders yet</p>
        </div>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}
    </div>
  );
}
