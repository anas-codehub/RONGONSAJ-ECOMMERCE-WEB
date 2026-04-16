import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // ← ADD THIS - missing import

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Truck, RefreshCw, Shield, Star } from "lucide-react";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ReviewForm from "@/components/shared/ReviewForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
      //   isPublished: true, // ← ADD THIS - only show published products
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[500px] bg-secondary rounded-2xl overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  priority // ← ADD THIS - prioritize main image
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-24 h-36 bg-muted rounded-full opacity-60" />
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Badge variant="secondary" className="text-base px-6 py-2">
                    Sold out
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-border shrink-0 cursor-pointer hover:border-primary transition-colors"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl font-medium text-foreground mt-1">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(avgRating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({product.reviews.length}{" "}
                  {product.reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Price */}
            {(() => {
              const hasDiscount =
                product.discount > 0 || product.discountAmount > 0;
              const finalPrice =
                product.discount > 0
                  ? Math.round(
                      product.price - (product.price * product.discount) / 100,
                    )
                  : product.discountAmount > 0
                    ? Math.round(product.price - product.discountAmount)
                    : product.price;
              const discountLabel =
                product.discount > 0
                  ? `-${product.discount}% off`
                  : product.discountAmount > 0
                    ? `-৳${product.discountAmount} off`
                    : "";

              return (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    {hasDiscount ? (
                      <>
                        <span className="text-4xl font-extrabold text-primary">
                          ৳{finalPrice.toLocaleString()}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                          ৳{product.price.toLocaleString()}
                        </span>
                        <span className="bg-destructive text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                          {discountLabel}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-extrabold text-primary">
                        ৳{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-sm text-destructive font-medium">
                      Only {product.stock} left!
                    </span>
                  )}
                </div>
              );
            })()}
            <Separator className="bg-border" />

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Description
                </p>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-destructive"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {product.stock > 0
                  ? `In stock (${product.stock} available)`
                  : "Out of stock"}
              </span>
            </div>

            {/* Add to cart */}
            <AddToCartButton product={product} />

            <Separator className="bg-border" />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: "Free delivery", sub: "Over ৳2000" },
                { icon: RefreshCw, label: "Easy returns", sub: "7 days" },
                { icon: Shield, label: "Secure pay", sub: "100% safe" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-1 p-3 bg-secondary rounded-xl"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-medium text-foreground mb-6">
            Customer Reviews
          </h2>

          <div className="mb-8">
            <ReviewForm productId={product.id} />
          </div>
          {product.reviews.length === 0 ? (
            <div className="bg-secondary rounded-2xl p-10 text-center">
              <Star className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-foreground font-medium">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to review this product
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
                        {review.user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review.user.name || "Anonymous User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
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
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-medium text-foreground mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="relative h-48 bg-secondary">
                    {relatedProduct.images[0] ? (
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-20 bg-muted rounded-full opacity-60" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {relatedProduct.name}
                    </p>
                    <p className="text-primary font-medium mt-1">
                      ৳{relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
