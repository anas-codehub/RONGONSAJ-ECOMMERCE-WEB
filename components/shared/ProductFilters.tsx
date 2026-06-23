"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  selectedCategory?: string;
  selectedSort?: string;
  search?: string;
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
];

export default function ProductFilters({
  categories,
  selectedCategory,
  selectedSort,
  search,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (priceRange.min) params.set("minPrice", priceRange.min);
    else params.delete("minPrice");

    if (priceRange.max) params.set("maxPrice", priceRange.max);
    else params.delete("maxPrice");

    params.delete("page");

    router.push(`/products?${params.toString()}`);
  };

  const clearAll = () => router.push("/products");

  const hasFilters = selectedCategory || selectedSort || search;

  return (
    <div className="space-y-4">
      {/* Active filters */}
      {hasFilters && (
        <div className="bg-secondary rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">
              Active filters
            </p>

            <button
              onClick={clearAll}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {search && (
              <button
                onClick={() => updateFilter("search", null)}
                className="text-xs bg-card border border-border text-foreground px-3 py-1 rounded-lg font-medium hover:border-primary"
              >
                "{search}" ×
              </button>
            )}

            {selectedCategory && (
              <button
                onClick={() => updateFilter("category", null)}
                className="text-xs bg-card border border-border text-foreground px-3 py-1 rounded-lg font-medium hover:border-primary"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name} ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">
          Category
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-x-visible scrollbar-hide">
          <button
            onClick={() => updateFilter("category", null)}
            className={`shrink-0 px-3 py-2 rounded-xl text-sm font-medium ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-primary/10"
            }`}
          >
            All categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`shrink-0 px-3 py-2 rounded-xl text-sm font-medium ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">
          Price range
        </p>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ৳"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            className="w-full h-9 px-3 rounded-xl border border-border bg-secondary text-sm outline-none focus:border-primary"
          />

          <span className="text-muted-foreground">—</span>

          <input
            type="number"
            placeholder="Max ৳"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            className="w-full h-9 px-3 rounded-xl border border-border bg-secondary text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyPriceFilter}
            className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-sm font-bold"
          >
            Apply
          </button>

          {(priceRange.min || priceRange.max) && (
            <button
              onClick={() => setPriceRange({ min: "", max: "" })}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">
          Sort by
        </p>

        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl font-medium ${
                selectedSort === opt.value ||
                (!selectedSort && opt.value === "newest")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
