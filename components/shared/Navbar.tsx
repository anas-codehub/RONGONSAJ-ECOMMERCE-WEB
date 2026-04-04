"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Filter popular searches based on input
  const filteredSuggestions = search.trim()
    ? popularSearches.filter((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      )
    : popularSearches;

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl shrink-0 text-foreground tracking-widest"
        >
          RONGONSAAJ
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative max-w-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                className="border-border pr-4"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              variant="outline"
              className="border-border shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Search dropdown */}
          {focused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg overflow-hidden z-50">
              {/* Categories */}
              <div className="p-3 border-b border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                  Shop by category
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

              {/* Popular searches / suggestions */}
              <div className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                  {search.trim() ? "Suggestions" : "Popular searches"}
                </p>
                {filteredSuggestions.length > 0 ? (
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
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">
                        Search for "{search}"
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative border-border"
            >
              <ShoppingCart className="h-4 w-4" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth */}
          {session ? (
            <div className="flex items-center gap-2">
              {(session.user as any)?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-border">
                    Admin
                  </Button>
                </Link>
              )}

              {/* Account dropdown */}
              <div className="relative group">
                <Button variant="outline" size="icon" className="border-border">
                  <User className="h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      My orders
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
            </div>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className="bg-primary text-primary-foreground">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
