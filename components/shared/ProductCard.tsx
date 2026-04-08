"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import WishlistButton from "@/components/shared/WishlistButton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
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
      <div className="group bg-white border border-[#FAC775] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Image */}
        <div className="relative h-56 bg-[#FAEEDA] overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-24 bg-[#FAC775] rounded-full opacity-60" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isFeatured && (
              <Badge className="bg-[#D85A30] text-[#FAEEDA] text-xs">
                Featured
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">
                Sold out
              </Badge>
            )}
          </div>

          {/* Wishlist */}

          <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center transition-opacity">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#854F0B] mb-1">{product.category.name}</p>
          <h3 className="text-sm font-medium text-[#412402] mb-3 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-[#D85A30]">
              ৳{product.price.toLocaleString()}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-[#FAEEDA] hover:bg-[#FAC775] text-[#854F0B] border border-[#FAC775] h-8 w-8 p-0 rounded-full"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
