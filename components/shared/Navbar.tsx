"use client";

import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  ShoppingBag,
  Heart,
  X,
} from "lucide-react";
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
  const { items } = useCartStore();
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (search.trim()) {
        router.push(`/products?search=${encodeURIComponent(search)}`);
        setFocused(false);
        setMobileSearchOpen(false);
        setSearch("");
      }
    },
    [search, router],
  );

  const handleSuggestionClick = useCallback(
    (s: string) => {
      router.push(`/products?search=${encodeURIComponent(s)}`);
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
      {/* Announcement bar — desktop only */}
      {/* <div className="hidden sm:block bg-[#3D2B1F] text-[#F0EBE3] text-center text-xs py-2 tracking-widest">
        Free delivery on orders over ৳2,000 · New drops every week
      </div> */}

      <nav
        className="sticky top-0 z-50 border-b border-border"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          {/* Logo — always visible */}
          <Link
            href="/"
            className="shrink-0 font-extrabold text-lg text-foreground tracking-widest"
          >
            RONGO<span className="text-primary">N</span>SAAJ
          </Link>

          {/* Desktop category links */}
          <div className="hidden md:flex items-center gap-5 ml-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products?sort=newest"
              className="text-sm text-primary font-extrabold"
            >
              New arrivals
            </Link>
          </div>

          {/* Search — takes full remaining width on mobile */}
          <div ref={searchRef} className="flex-1 relative">
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                className="w-full pl-9 pr-4 h-9 rounded-xl border border-border text-sm outline-none focus:border-primary transition-colors"
                style={{
                  background: "var(--secondary)",
                  color: "var(--foreground)",
                }}
              />
            </form>

            {/* Mobile search bar — always visible, full width */}
            <button
              className="md:hidden w-full flex items-center gap-2 h-9 px-3 rounded-xl border border-border text-sm text-muted-foreground"
              style={{ background: "var(--secondary)" }}
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">
                Search products...
              </span>
            </button>

            {/* Desktop search dropdown */}
            {focused && (
              <div
                className="hidden md:block absolute left-0 right-0 top-full mt-2 rounded-2xl z-50 overflow-hidden shadow-lg"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="p-3 border-b border-border">
                  <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
                    {search.trim() ? "Suggestions" : "Popular searches"}
                  </p>
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground font-medium">
                        {s}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right icons — desktop only */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {/* Cart */}
            <Link href="/cart">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {items.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-extrabold">
                    {items.length}
                  </span>
                )}
              </button>
            </Link>

            {/* Wishlist */}
            <Link href="/account/wishlist">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                <Heart className="h-5 w-5 text-foreground" />
              </button>
            </Link>

            {/* Auth */}
            {session ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground shrink-0">
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
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl z-50 overflow-hidden"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b border-border"
                      style={{ background: "var(--secondary)" }}
                    >
                      <p className="text-sm font-extrabold text-foreground truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    {(session.user as any)?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-extrabold border-b border-border hover:bg-secondary transition-colors"
                        style={{ background: "var(--card)" }}
                      >
                        Admin panel
                      </Link>
                    )}
                    <div style={{ background: "var(--card)" }}>
                      {[
                        {
                          href: "/account/orders",
                          icon: ShoppingBag,
                          label: "My orders",
                        },
                        {
                          href: "/account/wishlist",
                          icon: Heart,
                          label: "My wishlist",
                        },
                        {
                          href: "/account/profile",
                          icon: User,
                          label: "My profile",
                        },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {label}
                        </Link>
                      ))}
                    </div>
                    <div
                      className="border-t border-border"
                      style={{ background: "var(--card)" }}
                    >
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/sign-in" });
                          setProfileOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link href="/sign-in">
                  <button className="text-sm font-bold text-foreground px-3 py-1.5 rounded-xl hover:bg-secondary transition-colors">
                    Sign in
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-xl hover:bg-primary/90 transition-colors">
                    Sign up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile full-screen search overlay */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col md:hidden"
          style={{ background: "var(--background)" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0"
            style={{ background: "var(--background)" }}
          >
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 h-10 rounded-xl border border-border text-sm outline-none focus:border-primary transition-colors"
                style={{
                  background: "var(--secondary)",
                  color: "var(--foreground)",
                }}
              />
            </form>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearch("");
              }}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            <div>
              <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">
                Shop by category
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="text-sm font-bold px-4 py-3 rounded-xl border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-left"
                    style={{ background: "var(--secondary)" }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">
                {search.trim() ? "Suggestions" : "Popular searches"}
              </p>
              <div className="space-y-1">
                {filteredSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground font-medium">
                      {s}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
