"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Image,
  FolderOpen,
  ChevronRight,
  BookOpen,
  Truck,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },
  {
    label: "Hero slides",
    href: "/admin/slides",
    icon: Image,
  },

  { label: "Delivery", href: "/admin/delivery", icon: Truck },

  { label: "Admin guide", href: "/admin/guide", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-foreground min-h-screen  flex-col hidden md:flex">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-background/10">
        <Link
          href="/"
          className="text-lg font-extrabold text-background tracking-wider"
        >
          RONGO<span className="text-primary">N</span>SAAJ
        </Link>
        <p className="text-background/40 text-xs mt-0.5">Admin panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(href));

          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-background/50 hover:bg-background/10 hover:text-background"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3 w-3" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-background/10">
        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-background/40 hover:bg-background/10 hover:text-background transition-all">
            <ChevronRight className="h-4 w-4 rotate-180" />
            <span className="text-sm font-medium">Back to store</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
