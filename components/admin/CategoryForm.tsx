"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      setForm({
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create category");
        return;
      }

      toast.success("Category created!");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Category name
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Dresses"
            required
            className="border-border"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Slug
          </label>
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="dresses"
            required
            className="border-border"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-generated from name. Used in URLs.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading ? "Creating..." : "Create category"}
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
