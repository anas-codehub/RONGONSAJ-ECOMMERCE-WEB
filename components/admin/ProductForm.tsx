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
import ImageUpload from "./ImageUpload";

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
    actualPrice: number;
    discount: number;
    stock: number;
    images: string[];
    isFeatured: boolean;
    categoryId: string;
    sizes: string[];
    colors: string[];
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
    actualPrice: product?.actualPrice?.toString() || "",
    price: product?.price?.toString() || "",
    discount: product?.discount?.toString() || "0",
    stock: product?.stock?.toString() || "",
    categoryId: product?.categoryId || "",
    isFeatured: product?.isFeatured || false,
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images || [],
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const addSize = () => {
    const size = newSize.trim().toUpperCase();
    if (size && !sizes.includes(size)) {
      setSizes([...sizes, size]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    const color = newColor.trim();
    if (color && !colors.includes(color)) {
      setColors([...colors, color]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };
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
        actualPrice: parseFloat(form.actualPrice || "0"),
        price: parseFloat(form.price),
        discount: parseFloat(form.discount || "0"),
        stock: parseInt(form.stock),
        categoryId: form.categoryId,
        isFeatured: form.isFeatured,
        images: uploadedImages,
        sizes,
        colors,
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
          {/* Pricing section */}
          <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/50">
            <p className="text-sm font-bold text-foreground">Pricing</p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Actual price (৳)
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — your cost price (hidden from customers)
                  </span>
                </label>
                <Input
                  name="actualPrice"
                  type="number"
                  value={form.actualPrice}
                  onChange={handleChange}
                  placeholder="1000"
                  min="0"
                  className="border-border"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Selling price (৳)
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — shown to customers
                  </span>
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
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Discount (%)
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — shown as sale badge on product
                  </span>
                </label>
                <Input
                  name="discount"
                  type="number"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="border-border"
                />
              </div>
            </div>

            {/* Live profit preview */}
            {form.price && form.actualPrice && (
              <div className="bg-card border border-border rounded-xl p-3 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Profit preview
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Customer pays
                    </p>
                    <p className="text-sm font-extrabold text-foreground">
                      ৳
                      {(
                        parseFloat(form.price || "0") -
                        (parseFloat(form.price || "0") *
                          parseFloat(form.discount || "0")) /
                          100
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Your cost</p>
                    <p className="text-sm font-extrabold text-foreground">
                      ৳{parseFloat(form.actualPrice || "0").toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit/unit</p>
                    <p className="text-sm font-extrabold text-green-600">
                      ৳
                      {(
                        parseFloat(form.price || "0") -
                        (parseFloat(form.price || "0") *
                          parseFloat(form.discount || "0")) /
                          100 -
                        parseFloat(form.actualPrice || "0")
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            Product images
          </label>
          <ImageUpload images={uploadedImages} onChange={setUploadedImages} />
        </div>

        {/* Sizes */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Available sizes
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {sizes.map((size) => (
              <span
                key={size}
                className="flex items-center gap-1 bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="text-muted-foreground hover:text-destructive ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="e.g. S, M, L, XL"
              className="border-border"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSize}
              className="border-border shrink-0"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quick add:
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  if (!sizes.includes(s)) setSizes([...sizes, s]);
                }}
                className="ml-1 text-primary hover:underline"
              >
                {s}
              </button>
            ))}
          </p>
        </div>

        {/* Colors */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Available colors
          </label>
          <div className="flex gap-2 flex-wrap mb-2">
            {colors.map((color) => (
              <span
                key={color}
                className="flex items-center gap-1.5 bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border"
              >
                <span
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-muted-foreground hover:text-destructive ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="e.g. Red, Blue, Black"
              className="border-border"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addColor}
              className="border-border shrink-0"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quick add:
            {["Black", "White", "Red", "Blue", "Green", "Yellow"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (!colors.includes(c)) setColors([...colors, c]);
                }}
                className="ml-1 text-primary hover:underline"
              >
                {c}
              </button>
            ))}
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
