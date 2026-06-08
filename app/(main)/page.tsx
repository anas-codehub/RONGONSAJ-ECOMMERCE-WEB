import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/shared/ProductCard";
import HeroSlider from "@/components/shared/HeroSlider";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Truck,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { unstable_cache } from "next/cache";
import AllProductsSection from "@/components/shared/AllProductsSection";
import Image from "next/image";

const getFeaturedProducts = unstable_cache(
  async () =>
    db.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
      take: 8,
    }),
  ["featured-products"],
  { revalidate: 300 },
);

const getCategories = unstable_cache(
  async () =>
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      take: 8,
    }),
  ["categories"],
  { revalidate: 300 },
);
const getSlides = unstable_cache(
  async () =>
    db.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ["hero-slides"],
  { revalidate: 300 },
);

export const revalidate = 300;

export default async function HomePage() {
  const [featuredProducts, categories, slides, recentReviews] =
    await Promise.all([
      getFeaturedProducts(),
      getCategories(),
      getSlides(),
      db.review.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { user: true, product: true },
      }),
    ]);

  const [totalProducts, totalOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
  ]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* HERO */}
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <section className="bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[80vh] items-center">
              {/* LEFT */}
              <div className="flex flex-col justify-center py-12 md:py-20">
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <div className="w-8 h-0.5 bg-primary" />
                  <span className="text-primary text-xs font-bold tracking-[3px] uppercase">
                    New drops weekly
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                  Style is <br />
                  <span className="text-primary italic">your</span> <br />
                  story
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md">
                  Fashion for every chapter of your life. Curated with love from
                  Dhaka.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products">
                    <Button className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background px-6 py-5 rounded-2xl font-bold">
                      Shop collection
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/products?sort=newest">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-2 px-6 py-5 rounded-2xl font-bold"
                    >
                      New arrivals
                    </Button>
                  </Link>
                </div>

                {/* STATS */}
                <div className="flex flex-wrap gap-6 mt-10 pt-6 border-t border-border">
                  <div>
                    <p className="text-xl font-extrabold">{totalProducts}+</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">{totalOrders}+</p>
                    <p className="text-xs text-muted-foreground">
                      Orders delivered
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">4.9★</p>
                    <p className="text-xs text-muted-foreground">
                      Average rating
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="hidden md:grid grid-cols-2 gap-4">
                <div className="bg-primary rounded-3xl p-6 min-h-40 flex items-end">
                  <div>
                    <p className="text-primary-foreground/70 text-xs uppercase">
                      Featured
                    </p>
                    <p className="text-primary-foreground text-xl font-bold">
                      New collection
                    </p>
                  </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                  <div className="bg-foreground rounded-3xl p-5 flex items-end">
                    <p className="text-background font-bold">Trending</p>
                  </div>
                  <div className="bg-secondary border rounded-3xl p-5 flex items-end">
                    <p className="font-bold">Up to 50% off</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST BAR */}
      <section className="bg-foreground">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-4 text-center">
          {[
            { icon: Truck, text: "Free delivery over ৳2,000" },
            { icon: RefreshCw, text: "Easy 7-day returns" },
            { icon: Shield, text: "Secure payments" },
            { icon: Sparkles, text: "Premium quality" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-background/70 text-xs">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}

      {categories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-primary text-xs font-bold tracking-[4px] uppercase block mb-3">
                  Collections
                </span>
                <h2 className="text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  Shop by
                  <br />
                  category
                </h2>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                All products
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                  <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-48 bg-secondary overflow-hidden">
                      {(cat as any).image ? (
                        <Image
                          src={(cat as any).image}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                          <span className="text-5xl font-extrabold text-primary/20">
                            {cat.name[0]}
                          </span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Category name on image */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-extrabold text-lg leading-tight">
                          {cat.name}
                        </p>
                        <p className="text-white/70 text-xs mt-0.5">
                          {(cat as any)._count?.products || 0} products
                        </p>
                      </div>
                    </div>

                    {/* Browse button */}
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        Browse collection
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8">
            Featured products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <AllProductsSection />

      {/* REVIEWS */}
      {recentReviews.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center">
              What customers say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((r) => (
                <div key={r.id} className="bg-card border rounded-2xl p-5">
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= r.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm mb-4">"{r.comment}"</p>

                  <p className="text-xs font-bold">{r.user.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
