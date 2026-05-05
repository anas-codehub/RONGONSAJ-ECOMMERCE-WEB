"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface Color {
  id: string;
  name: string;
  hex: string;
}

const COMMON_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#EF4444" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#22C55E" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Brown", hex: "#92400E" },
  { name: "Grey", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Maroon", hex: "#7F1D1D" },
  { name: "Cream", hex: "#FEFCE8" },
  { name: "Beige", hex: "#F5F0E8" },
  { name: "Teal", hex: "#14B8A6" },
  { name: "Cyan", hex: "#06B6D4" },
  { name: "Lime", hex: "#84CC16" },
  { name: "Gold", hex: "#F59E0B" },
  { name: "Silver", hex: "#C0C0C0" },
];

export default function ColorsManager({ colors }: { colors: Color[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof COMMON_COLORS>([]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.trim().length > 0) {
      const filtered = COMMON_COLORS.filter((c) =>
        c.name.toLowerCase().startsWith(value.toLowerCase()),
      );
      setSuggestions(filtered);

      // Auto-fill hex if exact match
      const exact = COMMON_COLORS.find(
        (c) => c.name.toLowerCase() === value.toLowerCase(),
      );
      if (exact) setHex(exact.hex);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (color: { name: string; hex: string }) => {
    setName(color.name);
    setHex(color.hex);
    setSuggestions([]);
  };

  const handleAdd = async (colorName?: string, colorHex?: string) => {
    const finalName = colorName || name;
    const finalHex = colorHex || hex;

    if (!finalName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName.trim(),
          hex: finalHex,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add color");
        return;
      }
      toast.success(`Color "${data.name}" added!`);
      setName("");
      setHex("#000000");
      setSuggestions([]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, colorName: string) => {
    try {
      const res = await fetch("/api/admin/colors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        toast.error("Failed to delete color");
        return;
      }
      toast.success(`Color "${colorName}" removed!`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add color */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-foreground px-6 py-4">
          <h2 className="text-base font-extrabold text-background">
            Add new color
          </h2>
          <p className="text-background/50 text-xs mt-0.5">
            Type a color name — suggestions will appear automatically
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color name with suggestions */}
            <div className="relative">
              <label className="text-sm font-extrabold text-foreground block mb-1.5">
                Color name
              </label>
              <Input
                placeholder="e.g. Green, Navy, Cream..."
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="border-border bg-secondary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                    setSuggestions([]);
                  }
                  if (e.key === "Escape") setSuggestions([]);
                }}
              />

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg z-50"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                    >
                      <div
                        className="w-6 h-6 rounded-lg border border-border shrink-0"
                        style={{ background: s.hex }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {s.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto font-mono">
                        {s.hex}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color picker */}
            <div>
              <label className="text-sm font-extrabold text-foreground block mb-1.5">
                Color
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-11 h-11 rounded-xl border border-border cursor-pointer p-0.5"
                    style={{ background: "var(--secondary)" }}
                  />
                </div>
                <Input
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                  placeholder="#000000"
                  className="border-border bg-secondary font-mono text-sm flex-1"
                />
                <div
                  className="w-11 h-11 rounded-xl border border-border shrink-0"
                  style={{ background: hex }}
                />
              </div>
            </div>
          </div>

          {/* Preview + Add button */}
          <div className="flex items-center gap-4">
            {name && (
              <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2.5 border border-border">
                <div
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ background: hex }}
                />
                <span className="text-sm font-bold text-foreground">
                  {name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {hex}
                </span>
              </div>
            )}
            <button
              onClick={() => handleAdd()}
              disabled={loading || !name.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 ml-auto"
            >
              <Plus className="h-4 w-4" />
              Add color
            </button>
          </div>

          {/* Quick add common colors */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Quick add common colors
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleAdd(c.name, c.hex)}
                  disabled={colors.some(
                    (color) =>
                      color.name.toLowerCase() === c.name.toLowerCase(),
                  )}
                  className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-border/50"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existing colors */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-foreground">
            Current colors
          </h2>
          <span className="text-xs text-muted-foreground">
            {colors.length} colors
          </span>
        </div>
        <div className="p-6">
          {colors.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No colors added yet
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-3 py-2.5 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg border border-border shrink-0"
                    style={{ background: color.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {color.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {color.hex}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(color.id, color.name)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
