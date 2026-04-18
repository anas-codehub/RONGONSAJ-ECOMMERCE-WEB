import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight } from "lucide-react";
import InvoiceButton from "@/components/shared/InvoiceButton";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  const session = await auth();

  console.log("SESSION:", session);

  if (!session?.user?.id) redirect("/sign-in");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-medium text-foreground mb-8">My orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted" />
            <p className="text-lg font-medium text-foreground mb-1">
              No orders yet
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Your orders will appear here once you make a purchase
            </p>
            <Link
              href="/products"
              className="text-primary text-sm hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-2xl p-6"
              >
                {/* Order header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Order ID
                    </p>
                    <p className="text-sm font-medium text-foreground font-mono">
                      #{order.id}...
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.product.name}{" "}
                        <span className="text-xs">× {item.quantity}</span>
                      </span>
                      <span className="text-foreground font-medium">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Deliver to: {order.address.city}, {order.address.district}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <InvoiceButton
                      order={{
                        ...order,
                        user: {
                          name: session.user?.name || null,
                          email: session.user?.email || null,
                        },
                      }}
                    />
                    <span className="text-primary font-medium">
                      ৳{order.total.toLocaleString()}
                    </span>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 font-medium"
                    >
                      Details <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
