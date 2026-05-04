"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface Size {
  id: string;
  label: string;
  type: string;
}

export default function SizesManager({ sizes }: { sizes: Size[] }) {
  const router = useRouter();
  const [letterInput, setLetterInput] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [loading, setLoading] = useState(false);

  const letterSizes = sizes.filter((s) => s.type === "letter");
  const numberSizes = sizes.filter((s) => s.type === "number");

  const handleAdd = async (label: string, type: string) => {
    if (!label.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), type }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add size");
        return;
      }
      toast.success(`Size "${data.label}" added!`);
      if (type === "letter") setLetterInput("");
      else setNumberInput("");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    try {
      const res = await fetch("/api/admin/sizes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        toast.error("Failed to delete size");
        return;
      }
      toast.success(`Size "${label}" removed!`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Letter sizes */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-foreground px-6 py-4">
          <h2 className="text-base font-extrabold text-background">
            Letter sizes
          </h2>
          <p className="text-background/50 text-xs mt-0.5">
            e.g. XS, S, M, L, XL, XXL, XXXL
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Add input */}
          <div className="flex gap-3">
            <Input
              placeholder="e.g. XL, XXL, XXXL"
              value={letterInput}
              onChange={(e) => setLetterInput(e.target.value.toUpperCase())}
              className="border-border bg-secondary uppercase"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd(letterInput, "letter");
              }}
            />
            <button
              onClick={() => handleAdd(letterInput, "letter")}
              disabled={loading || !letterInput.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Quick add buttons */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL", "XXXL", "FREE SIZE"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => handleAdd(s, "letter")}
                    disabled={sizes.some((size) => size.label === s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Existing sizes */}
          {letterSizes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Current sizes ({letterSizes.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {letterSizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 rounded-xl"
                  >
                    <span className="text-sm font-extrabold text-foreground">
                      {size.label}
                    </span>
                    <button
                      onClick={() => handleDelete(size.id, size.label)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {letterSizes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No letter sizes added yet
            </p>
          )}
        </div>
      </div>

      {/* Number sizes */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-foreground px-6 py-4">
          <h2 className="text-base font-extrabold text-background">
            Number sizes
          </h2>
          <p className="text-background/50 text-xs mt-0.5">
            e.g. 28, 30, 32, 34, 36, 38, 40
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Add input */}
          <div className="flex gap-3">
            <Input
              placeholder="e.g. 32, 34, 36"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              className="border-border bg-secondary"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd(numberInput, "number");
              }}
            />
            <button
              onClick={() => handleAdd(numberInput, "number")}
              disabled={loading || !numberInput.trim()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {/* Quick add buttons */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {["26", "28", "30", "32", "34", "36", "38", "40", "42", "44"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => handleAdd(s, "number")}
                    disabled={sizes.some((size) => size.label === s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-border bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Existing sizes */}
          {numberSizes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Current sizes ({numberSizes.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {numberSizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 rounded-xl"
                  >
                    <span className="text-sm font-extrabold text-foreground">
                      {size.label}
                    </span>
                    <button
                      onClick={() => handleDelete(size.id, size.label)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {numberSizes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No number sizes added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
