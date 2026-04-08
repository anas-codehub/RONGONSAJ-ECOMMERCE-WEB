"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-medium text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground text-sm">
            Looks like you haven't added anything yet
          </p>
        </div>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-xl">
            Start shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-medium text-foreground">
            Your cart
            <span className="text-muted-foreground text-lg ml-3">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </h1>
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-border rounded-2xl p-5 flex gap-5"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-12 bg-muted rounded-full opacity-60" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Item removed");
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-primary font-medium mt-1">
                    ৳{item.price.toLocaleString()}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Subtotal:{" "}
                      <span className="text-foreground font-medium">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-medium text-foreground mb-5">
                Order summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    ৳{total().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-foreground">
                    {total() >= 2000 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      "৳100"
                    )}
                  </span>
                </div>
                {total() < 2000 && (
                  <p className="text-xs text-muted-foreground bg-secondary rounded-lg p-2">
                    Add ৳{(2000 - total()).toLocaleString()} more for free
                    delivery!
                  </p>
                )}
              </div>

              <Separator className="my-4 bg-border" />

              <div className="flex justify-between font-medium text-foreground mb-6">
                <span>Total</span>
                <span className="text-primary text-lg">
                  ৳{(total() + (total() >= 2000 ? 0 : 100)).toLocaleString()}
                </span>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-base">
                  Proceed to checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/products">
                <Button
                  variant="outline"
                  className="w-full mt-3 border-border text-muted-foreground hover:bg-secondary rounded-xl py-6"
                >
                  Continue shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
