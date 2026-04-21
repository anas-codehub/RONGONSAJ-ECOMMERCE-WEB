"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  ShoppingBag,
  User,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Account", href: "/account/profile", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { data: session } = useSession();
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed left-0 right-0 z-50 md:hidden border-t border-border"
      style={{
        background: "var(--background)",
        bottom: 0,
        position: "fixed",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          const isCart = label === "Cart";
          const isAccount = label === "Account";

          if (isAccount) {
            return (
              <div key={label} className="relative" ref={ref}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative"
                >
                  <div className="relative">
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        accountOpen ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      accountOpen ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Account
                  </span>
                </button>

                {/* Account popup card */}
                {accountOpen && (
                  <div
                    className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl shadow-xl overflow-hidden"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b border-border"
                      style={{ background: "var(--secondary)" }}
                    >
                      <p className="text-xs font-extrabold text-foreground truncate">
                        {session?.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user?.email || "Not signed in"}
                      </p>
                    </div>
                    <Link
                      href="/account/profile"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-secondary transition-colors"
                      style={{ background: "var(--card)", display: "flex" }}
                    >
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      My profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-secondary transition-colors border-t border-border"
                        style={{ background: "var(--card)", display: "flex" }}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin panel
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={label}
              href={session || href === "/" ? href : "/sign-in"}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isCart && items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
