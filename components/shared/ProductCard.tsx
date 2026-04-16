"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import WishlistButton from "@/components/shared/WishlistButton";

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

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border">
        {/* Image */}
        <div className="relative h-56 bg-secondary overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-24 bg-muted rounded-full opacity-40" />
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isFeatured && (
              <Badge className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-lg">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className="bg-foreground text-background text-xs font-bold px-2 py-0.5 rounded-lg">
                Sold out
              </Badge>
            )}
            {(product.discount > 0 || product.discountAmount > 0) && (
              <Badge className="bg-destructive text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                {product.discount > 0
                  ? `-${product.discount}%`
                  : `-৳${product.discountAmount}`}
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-sm">
            <WishlistButton productId={product.id} />
          </div>

          {/* Add to cart overlay */}
          {product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-foreground text-background py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">
            {product.category.name}
          </p>
          <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              {product.discount > 0 || product.discountAmount > 0 ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-extrabold text-primary">
                    ৳
                    {Math.round(
                      product.discount > 0
                        ? product.price -
                            (product.price * product.discount) / 100
                        : product.price - product.discountAmount,
                    ).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-base font-extrabold text-primary">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-destructive font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
