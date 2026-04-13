import Link from "next/link";
import { db } from "@/lib/db";
import ProductCard from "@/components/shared/ProductCard";
import HeroSlider from "@/components/shared/HeroSlider";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, categories, slides] = await Promise.all([
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
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Slider or Default Hero */}
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <section className="bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
              {/* Left */}
              <div className="flex flex-col justify-center px-8 py-16 md:py-24">
                <span className="text-primary text-xs font-bold tracking-[3px] uppercase mb-4">
                  New drops weekly
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-4 tracking-tight">
                  Style is
                  <br />
                  <span className="text-primary">your story</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
                  Fashion for every chapter of your life. Curated with love from
                  Dhaka.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/products">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background px-8 py-6 text-base rounded-xl font-bold">
                      Shop collection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/products?sort=newest">
                    <Button
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-base rounded-xl font-bold transition-all"
                    >
                      New arrivals
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Right — terracotta block */}
              <div className="bg-primary hidden md:flex items-center justify-center relative overflow-hidden">
                <div className="w-48 h-72 bg-primary-foreground/10 rounded-[80px] absolute -right-10 -top-10" />
                <div className="w-32 h-48 bg-primary-foreground/10 rounded-[60px] absolute -left-6 -bottom-6" />
                <div className="relative z-10 text-center">
                  <div className="w-32 h-48 bg-primary-foreground/20 rounded-[60px] mx-auto mb-4" />
                  <p className="text-primary-foreground/80 text-sm font-medium tracking-widest uppercase">
                    New collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Truck,
              label: "Free delivery",
              sub: "On orders over ৳2,000",
            },
            { icon: RefreshCw, label: "Easy returns", sub: "Within 7 days" },
            { icon: Shield, label: "Secure payment", sub: "100% protected" },
            {
              icon: Sparkles,
              label: "Premium quality",
              sub: "Handpicked pieces",
            },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Shop by category
            </h2>
            <Link
              href="/products"
              className="text-primary text-sm font-semibold hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <div className="group bg-secondary hover:bg-primary transition-all duration-300 rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-card group-hover:bg-primary-foreground/20 transition-colors flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-foreground group-hover:text-primary-foreground transition-colors text-center">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Featured products
          </h2>
          <Link
            href="/products"
            className="text-primary text-sm font-semibold hover:underline"
          >
            See all →
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-secondary rounded-3xl">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-lg font-bold text-foreground">No products yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Products will appear here once added from the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Split Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden">
          <div className="bg-foreground px-8 py-12">
            <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
              Limited time
            </p>
            <h2 className="text-3xl font-extrabold text-background leading-tight mb-4">
              Get 20% off
              <br />
              your first order
            </h2>
            <p className="text-background/60 mb-6 text-sm leading-relaxed">
              Sign up today and use code WELCOME20 at checkout.
            </p>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-xl font-bold">
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="bg-primary px-8 py-12 flex flex-col justify-center">
            <p className="text-primary-foreground/70 text-xs font-bold tracking-[3px] uppercase mb-3">
              New arrivals
            </p>
            <h2 className="text-3xl font-extrabold text-primary-foreground leading-tight mb-4">
              Fresh styles
              <br />
              every week
            </h2>
            <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed">
              Be the first to discover our latest collections.
            </p>
            <Link href="/products?sort=newest">
              <Button className="bg-foreground hover:bg-foreground/90 text-background px-8 py-5 rounded-xl font-bold">
                Shop new arrivals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
