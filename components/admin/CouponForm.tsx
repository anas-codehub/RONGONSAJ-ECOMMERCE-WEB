"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CouponForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    isPercent: true,
    isActive: true,
    expiresAt: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase(),
          discount: parseFloat(form.discount),
          isPercent: form.isPercent,
          isActive: form.isActive,
          expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create coupon");
        return;
      }

      toast.success("Coupon created!");
      router.push("/admin/coupons");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Coupon code
          </label>
          <Input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="e.g. WELCOME20"
            required
            className="border-border uppercase"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Discount value
          </label>
          <Input
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            placeholder="20"
            required
            min="0"
            className="border-border"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPercent"
            name="isPercent"
            checked={form.isPercent}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <label
            htmlFor="isPercent"
            className="text-sm font-medium text-foreground"
          >
            Percentage discount (% off)
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-foreground"
          >
            Active (usable by customers)
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Expiry date (optional)
          </label>
          <Input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
            className="border-border"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading ? "Creating..." : "Create coupon"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-border rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
