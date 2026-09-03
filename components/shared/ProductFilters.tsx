"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  categories: Category[];
  selectedCategory?: string;
  selectedSort?: string;
  search?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
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
  const hasFilters = selectedSort || search;

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

      {/* Sort only */}
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
