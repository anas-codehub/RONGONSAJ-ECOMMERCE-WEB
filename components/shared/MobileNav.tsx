"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search",
    href: "/products",
    icon: Search,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Account",
    href: "/account/orders",
    icon: User,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { data: session } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          const isCart = label === "Cart";
          const isAccount = label === "Account";

          return (
            <Link
              key={label}
              href={isAccount && !session ? "/sign-in" : href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors relative"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {/* Cart badge */}
                {isCart && items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
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
              {/* Active indicator */}
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
