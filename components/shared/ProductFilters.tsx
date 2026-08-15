"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

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
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
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

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
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
            {selectedSort && (
              <button
                onClick={() => updateFilter("sort", null)}
                className="text-xs bg-card border border-border text-foreground px-3 py-1 rounded-lg font-medium hover:border-primary"
              >
                {sortOptions.find((s) => s.value === selectedSort)?.label} ×
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
            className={`shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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
              className={`shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Sort dropdown */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">
          Sort by
        </p>
        <select
          value={selectedSort || ""}
          onChange={(e) => updateFilter("sort", e.target.value || null)}
          className="w-full h-10 px-3 rounded-xl border border-border text-sm font-medium outline-none focus:border-primary transition-colors cursor-pointer"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
          }}
        >
          <option value="">Default</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
