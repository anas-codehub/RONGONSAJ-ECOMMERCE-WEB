"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

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
  const clearAll = () => {
    router.push("/products");
  };

  const hasFilters = selectedCategory || selectedSort || Search;

  return (
    <div className="space-y-6">
      {/* Active filters */}
      {hasFilters && (
        <div className="bg-primary-background rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-primary-foreground">
              Active filters
            </p>
            <button
              onClick={clearAll}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3 " /> Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {search && (
              <Badge
                className="bg-white border border-border text-muted-foreground cursor-pointer"
                onClick={() => updateFilter("search", null)}
              >
                "{search}" x
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white border border-border rounded-xl p-4">
        <p className="text-sm font-medium text-foreground mb-3">Category</p>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "text-secondary-foreground hover:bg-primary-foreground"
            }`}
          >
            All categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-primary-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white border border-[#FAC775] rounded-xl p-4">
        <p className="text-sm font-medium text-[#412402] mb-3">Sort by</p>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter("sort", opt.value)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selectedSort === opt.value ||
                (!selectedSort && opt.value === "newest")
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-primary-foreground"
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
