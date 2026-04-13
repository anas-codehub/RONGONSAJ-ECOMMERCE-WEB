import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  Tag,
  TrendingUp,
  ArrowRight,
  ArrowUp,
} from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalCoupons,
    recentOrders,
    revenue,
    pendingOrders,
    deliveredOrders,
  ] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count(),
    db.coupon.count(),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
    }),
    db.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { status: "DELIVERED" } }),
  ]);

  const statusColors: Record<string, string> = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    PROCESSING:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    SHIPPED:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    DELIVERED:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Good day, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Revenue banner */}
      <div className="bg-foreground rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-background/50 text-sm font-medium mb-1">
            Total revenue
          </p>
          <p className="text-4xl font-extrabold text-background">
            ৳{(revenue._sum.total || 0).toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
              <ArrowUp className="h-3 w-3" />
              Active
            </div>
            <span className="text-background/40 text-xs">
              {totalOrders} orders total
            </span>
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Products",
            value: totalProducts,
            icon: Package,
            href: "/admin/products",
            sub: "Total listed",
          },
          {
            label: "Orders",
            value: totalOrders,
            icon: ShoppingBag,
            href: "/admin/orders",
            sub: `${pendingOrders} pending`,
          },
          {
            label: "Customers",
            value: totalUsers,
            icon: Users,
            href: "/admin/users",
            sub: "Registered users",
          },
          {
            label: "Coupons",
            value: totalCoupons,
            icon: Tag,
            href: "/admin/coupons",
            sub: "Active codes",
          },
        ].map(({ label, value, icon: Icon, href, sub }) => (
          <Link key={label} href={href}>
            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-3xl font-extrabold text-foreground mb-1">
                {value}
              </p>
              <p className="text-sm font-bold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-extrabold text-foreground">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground text-sm">
              No orders yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      #{order.id} · {order.items.length} items ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-extrabold text-primary">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-base font-extrabold text-foreground mb-4">
              Order status
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: "Pending",
                  value: pendingOrders,
                  color: "bg-yellow-400",
                },
                {
                  label: "Delivered",
                  value: deliveredOrders,
                  color: "bg-green-400",
                },
                { label: "Total", value: totalOrders, color: "bg-primary" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="text-base font-extrabold text-foreground mb-4">
              Quick actions
            </h2>
            <div className="space-y-2">
              {[
                { label: "Add product", href: "/admin/products/new" },
                { label: "Add category", href: "/admin/categories/new" },
                { label: "Add coupon", href: "/admin/coupons/new" },
                { label: "Add slide", href: "/admin/slides/new" },
              ].map(({ label, href }) => (
                <Link key={label} href={href}>
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors group">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
