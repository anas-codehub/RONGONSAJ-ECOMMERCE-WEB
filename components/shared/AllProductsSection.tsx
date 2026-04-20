import { db } from "@/lib/db";
import ProductCard from "@/components/shared/ProductCard";

export default async function AllProductsSection() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  if (products.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary text-xs font-bold tracking-[4px] uppercase block mb-3">
              All styles
            </span>
            <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
              All products
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {products.length} products
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
