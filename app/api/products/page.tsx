import { db } from "@/lib/db";
import ProductCard from "@/components/shared/ProductCard";

import { Sparkles } from "lucide-react";
import ProductFilters from "@/components/shared/ProductFilters";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    ...(params.category && {
      category: { slug: params.category },
    }),
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: "insensitive" as const } },
        {
          description: {
            contains: params.search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const orderBy =
    params.sort === "price_asc"
      ? { price: "asc" as const }
      : params.sort === "price_desc"
        ? { price: "desc" as const }
        : params.sort === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
    db.category.findMany(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <div className="bg-[#FAEEDA] border-b border-[#FAC775] px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-medium text-[#412402] mb-2">
            {params.search
              ? `Results for "${params.search}"`
              : params.category
                ? categories.find((c) => c.slug === params.category)?.name ||
                  "Products"
                : "All products"}
          </h1>
          <p className="text-[#854F0B] text-sm">
            {total} {total === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductFilters
              categories={categories}
              selectedCategory={params.category}
              selectedSort={params.sort}
              search={params.search}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-[#FAC775]" />
                <p className="text-lg font-medium text-[#412402]">
                  No products found
                </p>
                <p className="text-sm text-[#854F0B] mt-1">
                  Try a different search or category
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Link
                          key={p}
                          href={`/products?${new URLSearchParams({
                            ...(params.category
                              ? { category: params.category }
                              : {}),
                            ...(params.search ? { search: params.search } : {}),
                            ...(params.sort ? { sort: params.sort } : {}),
                            page: p.toString(),
                          })}`}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-[#D85A30] text-[#FAEEDA]"
                              : "bg-white border border-[#FAC775] text-[#854F0B] hover:bg-[#FAEEDA]"
                          }`}
                        >
                          {p}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
