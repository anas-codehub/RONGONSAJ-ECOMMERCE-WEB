"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Image,
  FolderOpen,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Hero slides", href: "/admin/slides", icon: Image },
];

export default function AdminHeader({ session }: { session: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        {/* Mobile menu button */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        {/* Page indicator */}
        <div className="hidden md:block">
          <p className="text-xs text-muted-foreground font-medium">
            Admin panel
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors relative">
            <Bell className="h-4 w-4 text-foreground" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-border ml-1">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {session?.user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-foreground leading-none">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Administrator
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "sign-in" })}
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
        <div className="md:hidden bg-foreground px-3 py-4 space-y-1 border-b border-border">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-background/60 hover:bg-background/10 hover:text-background transition-all">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
