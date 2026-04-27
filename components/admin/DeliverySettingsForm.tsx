"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Settings {
  id: string;
  insideDhaka: number;
  subDhaka: number;
  outsideDhaka: number;
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
    subDhaka: settings.subDhaka.toString(),
    outsideDhaka: settings.outsideDhaka.toString(),
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
          subDhaka: parseFloat(form.subDhaka),
          outsideDhaka: parseFloat(form.outsideDhaka),
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Dhaka */}
        <div>
          <label className="text-sm font-extrabold text-foreground block mb-1.5">
            Dhaka (৳)
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
            Main Dhaka city only
          </p>
        </div>

        {/* Sub Dhaka */}
        <div>
          <label className="text-sm font-extrabold text-foreground block mb-1.5">
            Sub Dhaka (৳)
          </label>
          <Input
            type="number"
            value={form.subDhaka}
            onChange={(e) => setForm({ ...form, subDhaka: e.target.value })}
            placeholder="120"
            min="0"
            required
            className="border-border bg-secondary h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Gazipur, Narayanganj etc.
          </p>
        </div>

        {/* Outside Dhaka */}
        <div>
          <label className="text-sm font-extrabold text-foreground block mb-1.5">
            Outside Dhaka (৳)
          </label>
          <Input
            type="number"
            value={form.outsideDhaka}
            onChange={(e) => setForm({ ...form, outsideDhaka: e.target.value })}
            placeholder="150"
            min="0"
            required
            className="border-border bg-secondary h-11"
          />
          <p className="text-xs text-muted-foreground mt-1">
            All other districts
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs font-extrabold text-foreground mb-3 uppercase tracking-wider">
          Live preview
        </p>
        <div className="space-y-2">
          {[
            {
              label: "🏙️ Dhaka customer",
              charge: form.insideDhaka,
              color: "text-green-600",
            },
            {
              label: "🌆 Sub Dhaka customer",
              charge: form.subDhaka,
              color: "text-blue-600",
            },
            {
              label: "🌍 Outside Dhaka customer",
              charge: form.outsideDhaka,
              color: "text-orange-600",
            },
          ].map(({ label, charge, color }) => (
            <div
              key={label}
              className="flex items-center justify-between bg-card rounded-xl px-4 py-2.5 border border-border"
            >
              <span className="text-sm text-foreground font-medium">
                {label}
              </span>
              <span className={`text-sm font-extrabold ${color}`}>
                ৳{charge || "0"}
              </span>
            </div>
          ))}
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
