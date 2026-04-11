"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
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

  const handleAdd = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: `${product.name}${selectedSize !== "one-size" ? ` (${selectedSize})` : ""}${selectedColor !== "one-color" ? ` - ${selectedColor}` : ""}`,
      price: product.price,
      image: product.images[0] || "",
      quantity,
    });
    toast.success(`${product.name} added to cart!`);
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
          <p className="text-sm font-medium text-foreground mb-2">
            Size
            {!selectedSize && (
              <span className="text-destructive ml-1 text-xs">
                — please select
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${
                  selectedSize === size
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white border-border text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
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

      {/* Add to cart */}
      <Button
        onClick={handleAdd}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-base"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to cart
      </Button>
    </div>
  );
}
