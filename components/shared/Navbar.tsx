"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categories = [
  { name: "Male", slug: "male" },
  { name: "Female", slug: "female" },
  { name: "Couple", slug: "couple" },
  { name: "Baby", slug: "baby" },
];

const popularSearches = ["Dress", "T-shirt", "Saree", "Panjabi", "Kurta"];

export default function Navbar() {
  const { items, clearCart } = useCartStore();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
      setFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    router.push(`/products?search=${suggestion}`);
    setFocused(false);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/products?category=${slug}`);
    setFocused(false);
    setSearch("");
  };

  const filteredSuggestions = search.trim()
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      )
    : popularSearches;

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#3D2B1F] text-[#F0EBE3] text-center text-xs py-2 tracking-wide">
        Free delivery on orders over ৳2,000 · New drops every week
      </div>

      <nav className="border-b border-border bg-[#F9F5F1] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl shrink-0 text-foreground tracking-wider"
          >
            RONGO<span className="text-primary">N</span>SAAJ
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 ml-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products?sort=newest"
              className="text-sm text-primary font-medium"
            >
              New arrivals
            </Link>
          </div>

          {/* Search */}
          <div ref={searchRef} className="flex-1 relative max-w-xs ml-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                className="pl-9 border-border bg-secondary text-sm h-9"
              />
            </form>

            {/* Search dropdown */}
            {focused && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {search.trim() ? "Suggestions" : "Popular searches"}
                  </p>
                  <div className="space-y-1">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link href="/cart">
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {items.length > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {items.length}
                  </span>
                )}
              </button>
            </Link>

            {/* Wishlist */}
            <Link href="/account/wishlist">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                <Heart className="h-5 w-5 text-foreground" />
              </button>
            </Link>

            {/* Auth */}
            {session ? (
              <div className="relative group">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    {(session.user as any)?.image ? (
                      <Image
                        src={(session.user as any).image}
                        alt="Profile"
                        width={28}
                        height={28}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      session.user?.name?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-secondary">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  {(session.user as any)?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-secondary transition-colors border-b border-border"
                    >
                      Admin panel
                    </Link>
                  )}
                  <div className="py-1">
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      My orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      My wishlist
                    </Link>
                    <Link
                      href="/account/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      My profile
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/sign-in">
                <button className="ml-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
                  Sign in
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products?sort=newest"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-primary font-medium"
            >
              New arrivals
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
