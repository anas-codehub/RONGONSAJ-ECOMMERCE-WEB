"use client";

import { signOut } from "next-auth/react";
import { LogOut, Menu, Bell, ShoppingBag, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag as Orders,
  Users,
  Tag,
  Image,
  FolderOpen,
  BookOpen,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Orders", href: "/admin/orders", icon: Orders },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Hero slides", href: "/admin/slides", icon: Image },
  { label: "Admin guide", href: "/admin/guide", icon: BookOpen },
];

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
}

export default function AdminHeader({ session }: { session: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      setRecentOrders(data.recentOrders || []);
      setPendingCount(data.pendingCount || 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch every 60 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    setBellOpen(!bellOpen);
    if (!bellOpen) fetchNotifications();
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString("en-BD");
  };

  return (
    <>
      <header className="bg-card border-b border-border px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>

        <div className="hidden md:block">
          <p className="text-xs text-muted-foreground font-medium">
            Admin panel
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Bell notification */}
          <div ref={bellRef} className="relative">
            <button
              onClick={handleBellClick}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors relative"
            >
              <Bell className="h-4 w-4 text-foreground" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-extrabold">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {bellOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between border-b border-border"
                  style={{ background: "var(--secondary)" }}
                >
                  <div>
                    <p className="text-sm font-extrabold text-foreground">
                      Notifications
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {pendingCount} pending orders
                    </p>
                  </div>
                  <Link
                    href="/admin/orders"
                    onClick={() => setBellOpen(false)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {/* Orders list */}
                <div
                  className="max-h-80 overflow-y-auto"
                  style={{ background: "var(--card)" }}
                >
                  {loading ? (
                    <div className="px-4 py-8 text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Loading...
                      </p>
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40" />
                      <p className="text-sm font-bold text-foreground">
                        No orders in last 24h
                      </p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <Link
                        key={order.id}
                        href="/admin/orders"
                        onClick={() => setBellOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-0"
                      >
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-extrabold text-foreground truncate">
                              {order.user.name ||
                                order.user.email ||
                                "Customer"}
                            </p>
                            <span className="text-xs font-extrabold text-primary shrink-0">
                              ৳{order.total.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                            #{order.id}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "PROCESSING"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "SHIPPED"
                                      ? "bg-purple-100 text-purple-800"
                                      : order.status === "DELIVERED"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {timeAgo(order.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div
                  className="px-4 py-3 border-t border-border"
                  style={{ background: "var(--secondary)" }}
                >
                  <Link
                    href="/admin/orders"
                    onClick={() => setBellOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-extrabold py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Go to orders
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin info + signout */}
          <div className="flex items-center gap-3 pl-3 border-l border-border ml-1">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-extrabold text-foreground leading-none">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Administrator
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors ml-1"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="md:hidden fixed left-0 top-16 bottom-0 w-72 z-50 overflow-y-auto"
            style={{
              background: "#3D2B1F",
              borderRight: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <nav className="px-3 py-4 space-y-1">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-background/60 hover:bg-background/10 hover:text-background transition-all">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
