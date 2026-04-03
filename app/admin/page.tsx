import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  Tag,
  ArrowRight,
  TrendingUp,
  HdIcon,
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
  ]);

  const stats = [
    {
      label: "Total products",
      value: totalProducts,
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total orders",
      value: totalOrders,
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total users",
      value: totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Active coupons",
      value: totalCoupons,
      icon: Tag,
      href: "/admin/coupons",
      color: "bg-secondary text-primary",
    },

    { label: "Add category", href: "/admin/categories/new" },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-medium text-foreground">
            Admin dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {session.user.name} 👋
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href}>
              <div className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition-all group">
                <div
                  className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}
                >
                  <HdIcon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-medium text-foreground mb-1">
                  {value}
                </p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Revenue */}
        <div className="bg-[#412402] rounded-2xl p-6 mb-10 flex items-center justify-between">
          <div>
            <p className="text-[#FAC775] text-sm mb-1">Total revenue</p>
            <p className="text-4xl font-medium text-[#FAEEDA]">
              ৳{(revenue._sum.total || 0).toLocaleString()}
            </p>
            <p className="text-[#EF9F27] text-sm mt-1">
              From {totalOrders} orders
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FAEEDA]/10 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-[#FAC775]" />
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Add product", href: "/admin/products/new" },
            { label: "Manage orders", href: "/admin/orders" },
            { label: "Manage users", href: "/admin/users" },
            { label: "Add coupon", href: "/admin/coupons/new" },
          ].map(({ label, href }) => (
            <Link key={label} href={href}>
              <div className="bg-secondary border border-border rounded-xl p-4 flex items-center justify-between hover:bg-muted transition-colors group">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-foreground">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} items ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-medium text-primary">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
