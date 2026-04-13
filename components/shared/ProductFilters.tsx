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

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
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
                className="text-xs bg-card border border-border text-foreground px-3 py-1 rounded-lg font-medium hover:border-primary transition-colors"
              >
                "{search}" ×
              </button>
            )}
            {selectedCategory && (
              <button
                onClick={() => updateFilter("category", null)}
                className="text-xs bg-card border border-border text-foreground px-3 py-1 rounded-lg font-medium hover:border-primary transition-colors"
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
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
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
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
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
