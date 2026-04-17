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

export default async function HomePage() {
  const [featuredProducts, categories, slides, recentReviews] =
    await Promise.all([
      db.product.findMany({
        where: { isFeatured: true },
        include: { category: true },
        take: 8,
      }),
      db.category.findMany({ take: 6 }),
      db.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      db.review.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { user: true, product: true },
      }),
    ]);

  const totalProducts = await db.product.count();
  const totalOrders = await db.order.count();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <section className="bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
              {/* Left */}
              <div className="flex flex-col justify-center py-16 md:py-24 pr-0 md:pr-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-primary" />
                  <span className="text-primary text-xs font-bold tracking-[3px] uppercase">
                    New drops weekly
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.05] mb-6 tracking-tight">
                  Style is
                  <br />
                  <span className="text-primary italic">your</span>
                  <br />
                  story
                </h1>
                <p className="text-muted-foreground text-lg mb-10 max-w-sm leading-relaxed">
                  Fashion for every chapter of your life. Curated with love from
                  Dhaka.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/products">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background px-8 py-6 text-base rounded-2xl font-bold group">
                      Shop collection
                      <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/products?sort=newest">
                    <Button
                      variant="outline"
                      className="border-2 border-border text-foreground hover:border-primary hover:text-primary px-8 py-6 text-base rounded-2xl font-bold transition-all"
                    >
                      New arrivals
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-12 pt-8 border-t border-border">
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      {totalProducts}+
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Products
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      {totalOrders}+
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Orders delivered
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground">
                      4.9★
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Average rating
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — split color block */}
              <div className="hidden md:grid grid-cols-2 gap-3 py-8">
                <div className="bg-primary rounded-3xl flex items-end p-6 min-h-[240px]">
                  <div>
                    <p className="text-primary-foreground/70 text-xs font-bold tracking-widest uppercase mb-1">
                      Featured
                    </p>
                    <p className="text-primary-foreground text-xl font-extrabold leading-tight">
                      New
                      <br />
                      collection
                    </p>
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="bg-foreground rounded-3xl flex items-end p-5">
                    <div>
                      <p className="text-background/60 text-xs font-bold tracking-widest uppercase mb-1">
                        Trending
                      </p>
                      <p className="text-background text-base font-extrabold">
                        This week
                      </p>
                    </div>
                  </div>
                  <div className="bg-secondary border border-border rounded-3xl flex items-end p-5">
                    <div>
                      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mb-1">
                        Sale
                      </p>
                      <p className="text-foreground text-base font-extrabold">
                        Up to 50% off
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust bar */}
      <section className="bg-foreground">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center md:justify-between gap-4">
          {[
            { icon: Truck, text: "Free delivery over ৳2,000" },
            { icon: RefreshCw, text: "Easy 7-day returns" },
            { icon: Shield, text: "Secure payments" },
            { icon: Sparkles, text: "Premium quality" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-background/70 text-xs font-medium">
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories — horizontal scroll */}
      {categories.length > 0 && (
        <section className="py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-2">
                  Browse
                </p>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Shop by category
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="shrink-0"
                >
                  <div
                    className={`group rounded-3xl px-8 py-6 min-w-[140px] text-center transition-all hover:scale-105 cursor-pointer ${
                      i % 3 === 0
                        ? "bg-primary text-primary-foreground"
                        : i % 3 === 1
                          ? "bg-foreground text-background"
                          : "bg-secondary border border-border text-foreground"
                    }`}
                  >
                    <p className="text-base font-extrabold">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-2">
                Handpicked
              </p>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Featured products
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-secondary rounded-3xl">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="text-lg font-bold text-foreground">
                No products yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Products will appear here once added from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full width CTA banner */}
      <section className="mx-4 mb-14 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-primary px-10 py-14">
            <p className="text-primary-foreground/70 text-xs font-bold tracking-[3px] uppercase mb-3">
              Limited time
            </p>
            <h2 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
              Get 20% off
              <br />
              your first order
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
              Sign up today and use code{" "}
              <span className="font-extrabold text-primary-foreground bg-primary-foreground/20 px-2 py-0.5 rounded-lg">
                WELCOME20
              </span>{" "}
              at checkout.
            </p>
            <Link href="/sign-up">
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-6 rounded-2xl font-extrabold text-base">
                Create account <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="bg-foreground px-10 py-14 flex flex-col justify-center">
            <p className="text-background/50 text-xs font-bold tracking-[3px] uppercase mb-3">
              Stay updated
            </p>
            <h2 className="text-4xl font-extrabold text-background leading-tight mb-4">
              Fresh styles
              <br />
              every week
            </h2>
            <p className="text-background/50 mb-8 leading-relaxed">
              New collections drop every week. Be the first to discover them.
            </p>
            <Link href="/products?sort=newest">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-2xl font-extrabold text-base">
                Shop new arrivals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      {recentReviews.length > 0 && (
        <section className="py-14 bg-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-2">
                Testimonials
              </p>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                What our customers say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4 font-medium">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground">
                      {review.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-foreground">
                        {review.user.name || "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.product.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
