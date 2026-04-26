"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Settings {
  id: string;
  insideDhaka: number;
  outsideDhaka: number;
  freeDeliveryMin: number;
}

export default function DeliverySettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    insideDhaka: settings.insideDhaka.toString(),
    outsideDhaka: settings.outsideDhaka.toString(),
    freeDeliveryMin: settings.freeDeliveryMin.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/delivery-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insideDhaka: parseFloat(form.insideDhaka),
          outsideDhaka: parseFloat(form.outsideDhaka),
          freeDeliveryMin: parseFloat(form.freeDeliveryMin),
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update delivery settings");
        return;
      }

      toast.success("Delivery settings updated!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-extrabold text-foreground block mb-1.5">
            Inside Dhaka (৳)
          </label>
          <Input
            type="number"
            value={form.insideDhaka}
            onChange={(e) => setForm({ ...form, insideDhaka: e.target.value })}
            placeholder="60"
            min="0"
            required
            className="border-border bg-secondary h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Delivery charge for Dhaka district customers
          </p>
        </div>

        <div>
          <label className="text-sm font-extrabold text-foreground block mb-1.5">
            Outside Dhaka (৳)
          </label>
          <Input
            type="number"
            value={form.outsideDhaka}
            onChange={(e) => setForm({ ...form, outsideDhaka: e.target.value })}
            placeholder="120"
            min="0"
            required
            className="border-border bg-secondary h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Delivery charge for all other districts
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-extrabold text-foreground block mb-1.5">
          Free delivery minimum order (৳)
        </label>
        <Input
          type="number"
          value={form.freeDeliveryMin}
          onChange={(e) =>
            setForm({ ...form, freeDeliveryMin: e.target.value })
          }
          placeholder="2000"
          min="0"
          required
          className="border-border bg-secondary h-11"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Orders above this amount get free delivery regardless of district
        </p>
      </div>

      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs font-extrabold text-foreground mb-2">Preview</p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p>
            🏙️ Dhaka customer ordering ৳
            {parseFloat(form.freeDeliveryMin || "0") - 100} →{" "}
            <span className="font-bold text-foreground">
              ৳{form.insideDhaka} delivery
            </span>
          </p>
          <p>
            🌍 Outside Dhaka customer ordering ৳
            {parseFloat(form.freeDeliveryMin || "0") - 100} →{" "}
            <span className="font-bold text-foreground">
              ৳{form.outsideDhaka} delivery
            </span>
          </p>
          <p>
            ✅ Any customer ordering ৳{form.freeDeliveryMin}+ →{" "}
            <span className="font-bold text-green-600">Free delivery</span>
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-extrabold transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
