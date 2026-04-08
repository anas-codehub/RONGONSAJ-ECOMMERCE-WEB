import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const orders = await db.order.findMany({
    include: {
      user: true,
      address: true,
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} orders total
          </p>
        </div>
        <AdminOrdersTable orders={orders} />
      </div>
    </div>
  );
}
