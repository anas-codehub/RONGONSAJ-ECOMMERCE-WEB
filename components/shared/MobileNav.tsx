"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleAccountClick = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    setAccountOpen(!accountOpen);
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: items.length },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border"
      style={{
        background: "var(--background)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={session ? href : "/sign-in"}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative min-w-[52px]"
            >
              {isActive && (
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
              )}
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                {badge && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-extrabold">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Account */}
        <div ref={ref} className="relative min-w-[52px]">
          <button
            onClick={handleAccountClick}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 w-full"
          >
            <User
              className={`h-5 w-5 transition-colors ${accountOpen ? "text-primary" : "text-muted-foreground"}`}
            />
            <span
              className={`text-[10px] font-bold transition-colors ${accountOpen ? "text-primary" : "text-muted-foreground"}`}
            >
              Account
            </span>
          </button>

          {/* Popup — only when signed in */}
          {accountOpen && session && (
            <div
              className="absolute bottom-full right-0 mb-3 w-52 rounded-2xl shadow-xl overflow-hidden z-50"
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
                  {session.user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.email}
                </p>
              </div>
              <div style={{ background: "var(--card)" }}>
                <Link
                  href="/account/profile"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-foreground hover:bg-secondary transition-colors"
                >
                  <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                  My profile
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-extrabold text-primary hover:bg-secondary transition-colors border-t border-border"
                    style={{ background: "var(--card)" }}
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    Admin panel
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
