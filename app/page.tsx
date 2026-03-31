import Link from "next/link";
import { db } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck, RefreshCw, Shield } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true },
    include: { category: true },
    take: 8,
  });

  const categories = await db.category.findMany({
    take: 6,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#FAEEDA] px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="inline-block bg-[#FAC775] text-[#633806] text-sm font-medium px-4 py-1.5 rounded-full">
              New collection 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-medium text-[#412402] leading-tight">
              Dress for the <br />
              <span className="text-[#D85A30]">life you love</span>
            </h1>
            <p className="text-[#854F0B] text-lg max-w-md leading-relaxed">
              Handpicked fashion pieces that celebrate your unique style every
              single day.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/products">
                <Button className="bg-[#D85A30] hover:bg-[#993C1D] text-[#FAEEDA] px-8 py-6 text-base rounded-xl">
                  Shop now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button
                  variant="outline"
                  className="border-[#D85A30] text-[#D85A30] hover:bg-[#FAEEDA] px-8 py-6 text-base rounded-xl"
                >
                  View lookbook
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-[#FAC775] rounded-full opacity-30" />
              <div className="absolute inset-8 bg-[#EF9F27] rounded-full opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-24 w-24 text-[#D85A30] opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-[#FAC775] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: Truck,
              label: "Free delivery",
              sub: "On orders over ৳2000",
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
              <div className="w-10 h-10 rounded-full bg-[#FAEEDA] flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-[#D85A30]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#412402]">{label}</p>
                <p className="text-xs text-[#854F0B]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-[#412402]">
              Shop by category
            </h2>
            <Link
              href="/products"
              className="text-[#D85A30] text-sm hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <div className="group bg-[#FAEEDA] hover:bg-[#FAC775] transition-colors rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-[#FAC775] group-hover:bg-[#EF9F27] transition-colors flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-[#854F0B]" />
                  </div>
                  <span className="text-sm font-medium text-[#412402] text-center">
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
          <h2 className="text-2xl font-medium text-[#412402]">
            Featured products
          </h2>
          <Link
            href="/products"
            className="text-[#D85A30] text-sm hover:underline"
          >
            See all →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-20 text-[#854F0B]">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No products yet</p>
            <p className="text-sm mt-1">
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

      {/* Banner */}
      <section className="bg-[#412402] mx-4 mb-14 rounded-3xl px-8 py-14 text-center">
        <p className="text-[#FAC775] text-sm font-medium mb-3">
          Limited time offer
        </p>
        <h2 className="text-3xl md:text-4xl font-medium text-[#FAEEDA] mb-4">
          Get 20% off your first order
        </h2>
        <p className="text-[#EF9F27] mb-8 max-w-md mx-auto">
          Sign up today and use code WELCOME20 at checkout.
        </p>
        <Link href="/sign-up">
          <Button className="bg-[#D85A30] hover:bg-[#993C1D] text-[#FAEEDA] px-8 py-6 text-base rounded-xl">
            Create account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
