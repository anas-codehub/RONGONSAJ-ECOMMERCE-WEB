import ProductGridSkeleton from "@/components/shared/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="bg-secondary border-b border-border px-4 py-10">
        <div className="max-w-7xl mx-auto space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="w-full lg:w-64 space-y-4 shrink-0">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <Skeleton className="h-4 w-16" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Products skeleton */}
          <div className="flex-1">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
