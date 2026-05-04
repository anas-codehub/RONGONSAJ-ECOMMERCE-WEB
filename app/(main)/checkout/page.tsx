"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Tag, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { handleEnterKey } from "@/hooks/useEnterToNext";
import {
  DELIVERY_ZONES,
  getDeliveryCharge,
  getZoneLabel,
} from "@/lib/districts";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponId, setCouponId] = useState<string | null>(null);
  const [deliverySettings, setDeliverySettings] = useState({
    insideDhaka: 60,
    subDhaka: 120,
    outsideDhaka: 150,
  });

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

  // Fetch delivery settings
  useEffect(() => {
    fetch("/api/admin/delivery-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.insideDhaka !== undefined) setDeliverySettings(data);
      })
      .catch(() => {});
  }, []);

  // Calculate delivery charge based on selected district
  const subtotal = total();
  const deliveryCharge = address.district
    ? getDeliveryCharge(address.district, deliverySettings)
    : 0;
  const zoneLabel = address.district ? getZoneLabel(address.district) : "";
  const discountAmount = couponId ? Math.round((subtotal * discount) / 100) : 0;
  const grandTotal = subtotal + deliveryCharge - discountAmount;

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
      const discountText = data.isPercent
        ? `${data.discount}% off`
        : `৳${data.discount} off`;
      toast.success(`Coupon applied! ${discountText} on ${data.productName}`);
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please sign in to place an order");
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
        toast.error(data.error || "Order failed");
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-success?orderId=${data.orderId}`);
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
        <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">
          Checkout
        </h1>

        {/* COD notice */}
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-2xl px-5 py-3 mb-8">
          <Package className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-primary font-semibold">
            Cash on Delivery — Pay when your order arrives. No advance payment
            needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Address */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-extrabold text-foreground mb-5">
                Delivery address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="border-border"
                    onKeyDown={(e) => handleEnterKey(e, "phone")}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Phone number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="border-border"
                    onKeyDown={(e) => handleEnterKey(e, "street")}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Street address
                  </label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="House no, road no, area"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="border-border"
                    onKeyDown={(e) => handleEnterKey(e, "city")}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    City / Upazila
                  </label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g. Mirpur, Uttara, Dhanmondi"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="border-border"
                  />
                </div>

                {/* District dropdown */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    District
                  </label>
                  <select
                    name="district"
                    value={address.district}
                    onChange={(e) =>
                      setAddress({ ...address, district: e.target.value })
                    }
                    required
                    className="w-full h-11 px-3 rounded-xl border border-border text-sm outline-none focus:border-primary transition-colors"
                    style={{
                      background: "var(--secondary)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="" disabled>
                      Select your district
                    </option>
                    <optgroup label="── Dhaka ──">
                      {DELIVERY_ZONES.dhaka.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="── Sub Dhaka ──">
                      {DELIVERY_ZONES.subDhaka.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="── Outside Dhaka ──">
                      {DELIVERY_ZONES.outsideDhaka.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Zone + charge preview */}
                  {address.district && (
                    <div className="flex items-center justify-between mt-2 bg-secondary rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        Zone: {zoneLabel}
                      </span>
                      <span className="text-xs font-extrabold text-primary">
                        Delivery charge: ৳{deliveryCharge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-extrabold text-foreground mb-4">
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
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ Coupon applied — {discount}% discount
                </p>
              )}
            </div>
          </div>

          {/* Right — Order summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-foreground mb-5">
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
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-5 h-8 bg-muted rounded-full opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-foreground shrink-0">
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
                  <span className="text-foreground font-medium">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <div>
                    <p>Delivery charge</p>
                    {address.district && (
                      <p className="text-xs mt-0.5">
                        {zoneLabel} — {address.district}
                      </p>
                    )}
                  </div>
                  <span className="text-foreground font-medium">
                    {address.district
                      ? `৳${deliveryCharge}`
                      : "Select district"}
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

              <div className="flex justify-between font-extrabold text-foreground mb-6">
                <span>Total</span>
                <span className="text-primary text-lg">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading || !address.district}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-base font-bold"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading
                  ? "Placing order..."
                  : "Place order — Cash on delivery"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                💵 Pay in cash when your order is delivered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
