"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import WishlistButton from "@/components/shared/WishlistButton";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  actualPrice: number;
  discount: number;
  discountAmount: number;
  images: string[];
  stock: number;
  isFeatured: boolean;
  category: { name: string };
}

interface Props {
  product: Product;
  size?: "default" | "small";
}

function ProductCard({ product, size = "default" }: Props) {
  const { addItem } = useCartStore();

  const hasDiscount = product.discount > 0 || product.discountAmount > 0;

  // Fix: Ensure finalPrice is properly calculated with proper rounding
  const finalPrice = (() => {
    if (product.discount > 0) {
      return Math.round(
        product.price - (product.price * product.discount) / 100,
      );
    }
    if (product.discountAmount > 0) {
      return Math.round(product.price - product.discountAmount);
    }
    return product.price;
  })();

  // Fix: Ensure savedAmount is never negative
  const savedAmount = Math.max(0, product.price - finalPrice);

  // Fix: Proper discount label formatting
  const discountLabel =
    product.discount > 0
      ? `${product.discount}%`
      : product.discountAmount > 0
        ? `৳${product.discountAmount}`
        : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Fix: Stop event propagation to prevent navigation
    if (product.stock === 0) return;

    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images[0] || "",
      quantity: 1,
      productId: "",
    });
    toast.success(`${product.name} added to cart!`);
  };

  const imageHeight = size === "small" ? "h-44" : "h-56";

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border flex flex-col">
        {/* Image */}
        <div
          className={`relative ${imageHeight} bg-secondary overflow-hidden shrink-0`}
        >
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Fix: Add sizes prop for better performance
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-20 bg-muted rounded-full opacity-40" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="bg-destructive  text-xs font-bold px-2 py-0.5 rounded-lg">
                -{discountLabel} off
              </span>
            )}
            {product.isFeatured && !hasDiscount && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-lg">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-foreground text-background text-xs font-bold px-2 py-0.5 rounded-lg">
                Sold out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-2 right-2 w-7 h-7 bg-card rounded-full flex items-center justify-center shadow-sm">
            <WishlistButton productId={product.id} />
          </div>

          {/* Add to cart */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-foreground text-background py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={`Add ${product.name} to cart`} // Fix: Add aria-label for accessibility
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add to cart
              </button>
            </div>
          )}
        </div>

        {/* Info — fixed height so all cards same size */}
        <div className="p-3 flex flex-col" style={{ height: "100px" }}>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide truncate mb-0.5">
            {product.category.name}
          </p>
          <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-auto">
            {product.name}
          </h3>

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-destructive font-bold">
              Only {product.stock} left!
            </p>
          )}

          {/* Price row — everything on one line */}
          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-extrabold text-primary whitespace-nowrap">
                ৳{finalPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through whitespace-nowrap hidden sm:block">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="text-right shrink-0">
                <p className="text-xs font-extrabold text-green-600 whitespace-nowrap leading-tight">
                  Save ৳{savedAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(ProductCard);
