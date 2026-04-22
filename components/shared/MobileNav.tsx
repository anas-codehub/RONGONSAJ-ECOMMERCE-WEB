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
  LogOut,
} from "lucide-react";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

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

  // Sign out using API call directly — most reliable method
  const handleSignOut = () => {
    setAccountOpen(false);
    window.location.href = "/api/auth/signout?callbackUrl=/sign-in";
  };
  const getCsrfToken = async () => {
    try {
      const res = await fetch("/api/auth/csrf");
      const data = await res.json();
      return data.csrfToken || "";
    } catch {
      return "";
    }
  };

  const handleAccountClick = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }
    setAccountOpen(!accountOpen);
  };

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  ];

  const checkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Backdrop */}
      {accountOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setAccountOpen(false)}
        />
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "var(--background)",
          borderTop: "1.5px solid var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Account popup */}
        {accountOpen && session && (
          <div
            className="absolute bottom-full left-3 right-3 mb-2 rounded-3xl overflow-hidden shadow-2xl z-50"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            {/* User header */}
            <div
              className="px-5 py-4 flex items-center gap-3 border-b border-border"
              style={{ background: "var(--secondary)" }}
            >
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-primary flex items-center justify-center text-base font-extrabold text-primary-foreground shrink-0">
                {(session.user as any)?.image ? (
                  <Image
                    src={(session.user as any).image}
                    alt="Profile"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  session.user?.name?.[0]?.toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-foreground truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ background: "var(--card)" }}>
              <Link
                href="/account/profile"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-3 px-5 py-4 text-sm font-bold text-foreground hover:bg-secondary transition-colors border-b border-border"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--secondary)" }}
                >
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                My profile
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-sm font-extrabold text-primary hover:bg-secondary transition-colors border-b border-border"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  Admin panel
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-destructive/10">
                  <LogOut className="h-4 w-4 text-destructive" />
                </div>
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Nav bar */}
        <div className="flex items-center px-2 py-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = checkActive(href);
            return (
              <Link
                key={label}
                href={href}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 relative"
              >
                {/* Active indicator line at top */}
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                    style={{
                      width: "24px",
                      height: "3px",
                      background: "var(--primary)",
                    }}
                  />
                )}

                {/* Icon container */}
                <div className="relative">
                  <div
                    className="w-10 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: active ? "#E07B5420" : "transparent",
                    }}
                  >
                    <Icon
                      className="h-5 w-5 transition-colors"
                      style={{
                        color: active
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      }}
                    />
                  </div>
                </div>

                <span
                  className="text-[10px] font-bold leading-none transition-colors"
                  style={{
                    color: active
                      ? "var(--primary)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Account button */}
          <div ref={ref} className="flex-1 relative">
            <button
              onClick={handleAccountClick}
              className="w-full flex flex-col items-center gap-1 py-1.5 relative"
            >
              {accountOpen && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: "24px",
                    height: "3px",
                    background: "var(--primary)",
                  }}
                />
              )}
              <div
                className="w-10 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: accountOpen ? "#E07B5420" : "transparent",
                }}
              >
                {session && (session.user as any)?.image ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={(session.user as any).image}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <User
                    className="h-5 w-5 transition-colors"
                    style={{
                      color: accountOpen
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                    }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-bold leading-none transition-colors"
                style={{
                  color: accountOpen
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              >
                Account
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
