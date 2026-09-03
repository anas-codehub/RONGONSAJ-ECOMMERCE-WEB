"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  discountAmount: number;
  images: string[];
  stock: number;
  sizes: string[];
  colors: string[];
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length > 0 ? null : "one-size",
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors.length > 0 ? null : "one-color",
  );
  const { addItem } = useCartStore();

  const router = useRouter();

  const finalPrice =
    product.discount > 0
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.discountAmount > 0
        ? Math.round(product.price - product.discountAmount)
        : product.price;

  const validateSelections = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    return true;
  };

  const buildCartItem = () => ({
    id: `${product.id}-${selectedSize}-${selectedColor}`,
    productId: product.id,
    name: `${product.name}${selectedSize !== "one-size" ? ` (${selectedSize})` : ""}${selectedColor !== "one-color" ? ` - ${selectedColor}` : ""}`,
    price: finalPrice,
    image: product.images[0] || "",
    quantity,
  });

  const handleAdd = () => {
    if (!validateSelections()) return;
    addItem(buildCartItem());
    toast.success(`${product.name} added to cart!`);
  };

  const handleOrderNow = () => {
    if (!validateSelections()) return;
    addItem(buildCartItem());
    router.push("/checkout");
  };

  if (product.stock === 0) {
    return (
      <Button
        disabled
        className="w-full py-6 rounded-xl text-base"
        variant="secondary"
      >
        Out of stock
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Size selector */}

      {product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-extrabold text-foreground mb-3">
            Size
            {selectedSize && selectedSize !== "one-size" && (
              <span className="text-primary ml-2 font-bold">
                — {selectedSize}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-extrabold border-2 transition-all duration-200 ${
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground scale-105 shadow-md"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                }`}
              >
                {size}
                {selectedSize === size && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          {!selectedSize && (
            <p className="text-xs text-muted-foreground mt-2">
              Please select a size
            </p>
          )}
        </div>
      )}
      {/* Color selector */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">
            Color
            {selectedColor && selectedColor !== "one-color" && (
              <span className="text-muted-foreground ml-2 font-normal">
                — {selectedColor}
              </span>
            )}
            {!selectedColor && (
              <span className="text-destructive ml-1 text-xs">
                — please select
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-primary scale-110"
                    : "border-transparent hover:border-muted"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-foreground">Quantity</p>
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buttons row — Add to Cart + Order Now */}
      <div className="flex gap-3">
        <Button
          onClick={handleAdd}
          variant="outline"
          className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-6 rounded-xl text-base font-bold transition-all"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>

        <Button
          onClick={handleOrderNow}
          className="flex-1 bg-orange-500 hover:bg-orange-300 text-primary-foreground py-6 rounded-xl text-base font-bold"
        >
          <Zap className="h-5 w-5 mr-2" />
          Order Now
        </Button>
      </div>
    </div>
  );
}
