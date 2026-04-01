"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    district: "",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const deliveryFee = total() >= 2000 ? 0 : 100;
  const subtotal = total();
  const discountAmount = couponId ? Math.round((subtotal * discount) / 100) : 0;
  const grandTotal = subtotal + deliveryFee - discountAmount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch(`/api/coupons/validate?code=${couponCode}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon");
        return;
      }
      setDiscount(data.discount);
      setCouponId(data.id);
      toast.success(`Coupon applied! ${data.discount}% off`);
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to checkout");
      router.push("/sign-in");
      return;
    }

    const { fullName, phone, street, city, district } = address;
    if (!fullName || !phone || !street || !city || !district) {
      toast.error("Please fill in all address fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          couponId,
          total: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Checkout failed");
        return;
      }

      // Redirect to SSLCommerz payment page
      if (data.paymentUrl) {
        clearCart();
        window.location.href = data.paymentUrl;
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-foreground font-medium">Your cart is empty</p>
        <Link href="/products">
          <Button className="bg-primary text-primary-foreground rounded-xl">
            Shop now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-medium text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Address form */}
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-medium text-foreground mb-5">
                Delivery address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Full name
                  </label>
                  <Input
                    name="fullName"
                    placeholder="Your full name"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Phone number
                  </label>
                  <Input
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Street address
                  </label>
                  <Input
                    name="street"
                    placeholder="House, road, area"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      City
                    </label>
                    <Input
                      name="city"
                      placeholder="Dhaka"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      District
                    </label>
                    <Input
                      name="district"
                      placeholder="Dhaka"
                      value={address.district}
                      onChange={handleAddressChange}
                      className="border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Coupon code
              </h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="border-border"
                  disabled={!!couponId}
                />
                <Button
                  onClick={applyCoupon}
                  disabled={couponLoading || !!couponId}
                  variant="outline"
                  className="border-border shrink-0"
                >
                  {couponLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Tag className="h-4 w-4 mr-1" />
                  )}
                  Apply
                </Button>
              </div>
              {couponId && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Coupon applied — {discount}% discount
                </p>
              )}
            </div>
          </div>

          {/* Right — Order summary */}
          <div>
            <div className="bg-white border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-medium text-foreground mb-5">
                Order summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-5 h-8 bg-muted rounded-full opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border mb-4" />

              {/* Totals */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-foreground">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <Separator className="bg-border mb-4" />

              <div className="flex justify-between font-medium text-foreground mb-6">
                <span>Total</span>
                <span className="text-primary text-lg">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-base"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Processing..." : "Pay now"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Secured by SSLCommerz · Your payment is safe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
