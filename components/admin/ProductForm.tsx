"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    isFeatured: boolean;
    categoryId: string;
  };
}

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "",
    categoryId: product?.categoryId || "",
    isFeatured: product?.isFeatured || false,
    images: product?.images?.join(", ") || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });

    // Auto generate slug from name
    if (name === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId,
        isFeatured: form.isFeatured,
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(
        isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
        return;
      }

      toast.success(isEdit ? "Product updated!" : "Product created!");
      router.push("/admin/products");
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
            Product name
          </label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Floral midi dress"
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
            placeholder="floral-midi-dress"
            required
            className="border-border"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Auto-generated from name. Used in the URL.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Description
          </label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the product..."
            required
            rows={4}
            className="border-border resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Price (৳)
            </label>
            <Input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="1500"
              required
              min="0"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Stock
            </label>
            <Input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="50"
              required
              min="0"
              className="border-border"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Category
          </label>
          <Select
            value={form.categoryId}
            onValueChange={(val) => setForm({ ...form, categoryId: val })}
          >
            <SelectTrigger className="border-border">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Image URLs
          </label>
          <Input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://..., https://..."
            className="border-border"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Separate multiple URLs with commas
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 accent-primary"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-foreground"
          >
            Feature this product on homepage
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {loading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save changes"
              : "Create product"}
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
