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
import { useState, useRef, useEffect, useCallback } from "react";
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (search.trim()) {
        router.push(`/products?search=${search}`);
        setFocused(false);
        setMobileSearchOpen(false);
        setSearch("");
      }
    },
    [search, router],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setSearch(suggestion);
      router.push(`/products?search=${suggestion}`);
      setFocused(false);
      setMobileSearchOpen(false);
      setSearch("");
    },
    [router],
  );

  const handleCategoryClick = useCallback(
    (slug: string) => {
      router.push(`/products?category=${slug}`);
      setFocused(false);
      setMobileOpen(false);
      setMobileSearchOpen(false);
      setSearch("");
    },
    [router],
  );

  const filteredSuggestions = search.trim()
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      )
    : popularSearches;

  return (
    <>
      {/* Top announcement bar - hide on mobile */}
      <div className="bg-[#3D2B1F] text-[#F0EBE3] text-center text-xs py-2 tracking-wide hidden sm:block">
        Free delivery on orders over ৳2,000 · New drops every week
      </div>

      <nav className="border-b border-border bg-[#F9F5F1] sticky top-0 z-50">
        {/* Main navbar */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl shrink-0 text-foreground tracking-wider"
            onClick={() => {
              setMobileOpen(false);
              setMobileSearchOpen(false);
            }}
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

          {/* Desktop Search */}
          <div
            ref={searchRef}
            className="hidden md:block flex-1 relative max-w-xs ml-auto"
          >
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
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl z-50 overflow-hidden bg-white border border-gray-200">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    {search.trim() ? "Suggestions" : "Popular searches"}
                  </p>
                  <div className="space-y-1">
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-700">
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
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Mobile search button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>

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

            {/* Wishlist - hide on mobile */}
            <Link href="/account/wishlist" className="hidden sm:block">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                <Heart className="h-5 w-5 text-foreground" />
              </button>
            </Link>

            {/* Auth */}
            {session ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
                  aria-label="Profile"
                >
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

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    {(session.user as any)?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        Admin panel
                      </Link>
                    )}
                    <div className="py-1">
                      <Link
                        href="/account/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                        My orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-gray-400" />
                        My wishlist
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        My profile
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/sign-in" });
                          setProfileOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/sign-in">
                <button className="ml-1 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors hidden sm:block">
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-20 border-border bg-secondary text-sm h-10 w-full"
                autoFocus
              />
              {search && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg"
                >
                  Search
                </button>
              )}
            </form>

            {/* Mobile search suggestions */}
            {search && filteredSuggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Suggestions
                </p>
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
            )}
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="md:hidden fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 z-50 overflow-y-auto">
              <div className="px-4 py-6 space-y-6">
                {/* User info for mobile */}
                {session && (
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                      {(session.user as any)?.image ? (
                        <Image
                          src={(session.user as any).image}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        session.user?.name?.[0]?.toUpperCase() || "U"
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Shop by Category
                  </p>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 px-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Links
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/products?sort=newest"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-3 text-base text-primary font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      New Arrivals
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      My Wishlist
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      My Orders
                    </Link>
                    {session && (
                      <Link
                        href="/account/profile"
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 px-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        My Profile
                      </Link>
                    )}
                  </div>
                </div>

                {/* Auth for mobile */}
                {!session && (
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center bg-primary text-white py-3 rounded-xl font-medium"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {session && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/sign-in" });
                        setMobileOpen(false);
                      }}
                      className="block w-full text-center bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  );
}
