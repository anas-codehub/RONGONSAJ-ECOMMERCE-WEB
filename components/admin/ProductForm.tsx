"use client";

import { useEffect, useRef, useState } from "react";
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
    discountAmount: number;
    stock: number;
    images: string[];
    isFeatured: boolean;
    categoryId: string;
    sizes: string[];
    colors: string[];
    coupons?: {
      code: string;
      discount: number;
      isPercent: boolean;
      usageLimit: number;
      expiresAt: string | Date;
    }[];
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
    discountAmount: product?.discountAmount?.toString() || "0",
    discountType:
      product?.discountAmount && product.discountAmount > 0
        ? "amount"
        : "percent",
    stock: product?.stock?.toString() || "",
    categoryId: product?.categoryId || "",
    isFeatured: product?.isFeatured || false,
  });

  const [coupon, setCoupon] = useState({
    code: product?.coupons?.[0]?.code || "",
    discount: product?.coupons?.[0]?.discount?.toString() || "",
    isPercent: product?.coupons?.[0]?.isPercent ?? true,
    usageLimit: product?.coupons?.[0]?.usageLimit?.toString() || "100",
    expiresAt: product?.coupons?.[0]?.expiresAt
      ? new Date(product.coupons[0].expiresAt).toISOString().split("T")[0]
      : "",
    remove: false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images || [],
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const [availableSizes, setAvailableSizes] = useState<
    { id: string; label: string; type: string }[]
  >([]);
  const [availableColors, setAvailableColors] = useState<
    { id: string; name: string; hex: string }[]
  >([]);
  const [colorInput, setColorInput] = useState("");
  const [colorSuggestions, setColorSuggestions] = useState<
    { id: string; name: string; hex: string }[]
  >([]);
  const colorInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/sizes").then((r) => r.json()),
      fetch("/api/admin/colors").then((r) => r.json()),
    ]).then(([sizesData, colorsData]) => {
      setAvailableSizes(sizesData);
      setAvailableColors(colorsData);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorInputRef.current &&
        !colorInputRef.current.contains(e.target as Node)
      ) {
        setColorSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        discount:
          form.discountType === "percent"
            ? parseFloat(form.discount || "0")
            : 0,
        discountAmount:
          form.discountType === "amount"
            ? parseFloat(form.discountAmount || "0")
            : 0,
        stock: parseInt(form.stock),
        categoryId: form.categoryId,
        isFeatured: form.isFeatured,
        images: uploadedImages,
        sizes,
        colors,

        coupon: coupon.code
          ? {
              code: coupon.code,
              discount: parseFloat(coupon.discount || "0"),
              isPercent: coupon.isPercent,
              usageLimit: parseInt(coupon.usageLimit || "100"),
              expiresAt: coupon.expiresAt || null,
            }
          : coupon.remove
            ? { remove: true }
            : null,
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
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pricing section */}

          <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/50">
            <p className="text-sm font-bold text-foreground">Pricing</p>

            <div className="grid grid-cols-1 gap-4">
              {/* Actual price */}
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

              {/* Selling price */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Selling price (৳)
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — shown to customers before discount
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

              {/* Discount type toggle */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Discount type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        discountType: "percent",
                        discountAmount: "0",
                      })
                    }
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                      form.discountType === "percent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    By percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        discountType: "amount",
                        discount: "0",
                      })
                    }
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                      form.discountType === "amount"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    By amount (৳)
                  </button>
                </div>
              </div>

              {/* Discount input */}
              {form.discountType === "percent" ? (
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Discount percentage (%)
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      — e.g. 10 means 10% off
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
              ) : (
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Discount amount (৳)
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      — e.g. 200 means ৳200 off
                    </span>
                  </label>
                  <Input
                    name="discountAmount"
                    type="number"
                    value={form.discountAmount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="border-border"
                  />
                </div>
              )}
            </div>

            {/* Live profit preview */}
            {form.price && form.actualPrice && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Live preview
                </p>
                {(() => {
                  const sellingPrice = parseFloat(form.price || "0");
                  const actualPrice = parseFloat(form.actualPrice || "0");
                  const discountPercent =
                    form.discountType === "percent"
                      ? parseFloat(form.discount || "0")
                      : sellingPrice > 0
                        ? (parseFloat(form.discountAmount || "0") /
                            sellingPrice) *
                          100
                        : 0;
                  const discountAmt =
                    form.discountType === "amount"
                      ? parseFloat(form.discountAmount || "0")
                      : (sellingPrice * parseFloat(form.discount || "0")) / 100;
                  const customerPays = Math.round(sellingPrice - discountAmt);
                  const profit = customerPays - actualPrice;

                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-secondary rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Customer pays
                        </p>
                        <p className="text-lg font-extrabold text-foreground">
                          ৳{customerPays.toLocaleString()}
                        </p>
                        {discountAmt > 0 && (
                          <p className="text-xs text-muted-foreground line-through mt-0.5">
                            ৳{sellingPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="bg-secondary rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Discount
                        </p>
                        <p className="text-lg font-extrabold text-primary">
                          ৳{Math.round(discountAmt).toLocaleString()}
                        </p>
                        {discountPercent > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {discountPercent.toFixed(1)}% off
                          </p>
                        )}
                      </div>
                      <div className="bg-secondary rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">
                          Your cost
                        </p>
                        <p className="text-lg font-extrabold text-foreground">
                          ৳{actualPrice.toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`rounded-xl p-3 text-center ${
                          profit >= 0
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-red-50 dark:bg-red-900/20"
                        }`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          Profit/unit
                        </p>
                        <p
                          className={`text-lg font-extrabold ${
                            profit >= 0 ? "text-green-600" : "text-destructive"
                          }`}
                        >
                          ৳{Math.round(profit).toLocaleString()}
                        </p>
                        {profit < 0 && (
                          <p className="text-xs text-destructive mt-0.5">
                            Loss!
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Coupon section */}
          <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">
                Product coupon
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  — optional, only works for this product
                </span>
              </p>
              {coupon.code && (
                <button
                  type="button"
                  onClick={() =>
                    setCoupon({ ...coupon, code: "", remove: true })
                  }
                  className="text-xs text-destructive hover:underline font-medium"
                >
                  Remove coupon
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Coupon code
                </label>
                <Input
                  value={coupon.code}
                  onChange={(e) =>
                    setCoupon({
                      ...coupon,
                      code: e.target.value.toUpperCase(),
                      remove: false,
                    })
                  }
                  placeholder="e.g. SAVE20"
                  className="border-border uppercase"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Works in any case — SAVE20, save20, Save20
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Discount value
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={coupon.discount}
                    onChange={(e) =>
                      setCoupon({ ...coupon, discount: e.target.value })
                    }
                    placeholder="20"
                    min="0"
                    className="border-border flex-1"
                  />
                  <div className="flex rounded-xl border border-border overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => setCoupon({ ...coupon, isPercent: true })}
                      className={`px-3 py-2 text-sm font-bold transition-colors ${
                        coupon.isPercent
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoupon({ ...coupon, isPercent: false })}
                      className={`px-3 py-2 text-sm font-bold transition-colors ${
                        !coupon.isPercent
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      ৳
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Usage limit
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — max users who can use this coupon
                  </span>
                </label>
                <Input
                  type="number"
                  value={coupon.usageLimit}
                  onChange={(e) =>
                    setCoupon({ ...coupon, usageLimit: e.target.value })
                  }
                  placeholder="100"
                  min="1"
                  className="border-border"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Expiry date
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    — optional
                  </span>
                </label>
                <Input
                  type="date"
                  value={coupon.expiresAt}
                  onChange={(e) =>
                    setCoupon({ ...coupon, expiresAt: e.target.value })
                  }
                  className="border-border"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Coupon preview */}
            {coupon.code && coupon.discount && (
              <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm">🏷️</span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground font-mono">
                      {coupon.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {coupon.discount}
                      {coupon.isPercent ? "%" : "৳"} off · Max{" "}
                      {coupon.usageLimit} uses
                      {coupon.expiresAt &&
                        ` · Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-BD")}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Active
                </span>
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

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1.5">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full h-11 px-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                style={{
                  background: "var(--card)",
                  color: "var(--foreground)",
                }}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Product images
          </label>
          <p className="text-xs text-muted-foreground mt-2 bg-secondary rounded-xl p-3 leading-relaxed">
            <span className="font-bold text-foreground">
              Recommended image sizes:
            </span>
            <br />• <span className="font-bold">Product images:</span> 800×800px
            (square) or 800×1000px (portrait) · JPG or PNG · max 5MB
            <br />• <span className="font-bold">Best format:</span> White or
            light background for clean product display
            <br />• <span className="font-bold">Avoid:</span> Very dark
            backgrounds, blurry images, or watermarks
          </p>
          <ImageUpload images={uploadedImages} onChange={setUploadedImages} />
        </div>

        {/* Sizes */}
        {/* Sizes */}
        <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/50">
          <p className="text-sm font-bold text-foreground">Sizes</p>

          {/* Letter sizes */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Letter sizes
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes
                .filter((s) => s.type === "letter")
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (sizes.includes(s.label)) {
                        setSizes(sizes.filter((x) => x !== s.label));
                      } else {
                        setSizes([...sizes, s.label]);
                      }
                    }}
                    className={`text-sm font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      sizes.includes(s.label)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              {availableSizes.filter((s) => s.type === "letter").length ===
                0 && (
                <p className="text-xs text-muted-foreground">
                  No letter sizes added yet.{" "}
                  <a href="/admin/sizes" className="text-primary underline">
                    Add sizes →
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Number sizes */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Number sizes
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes
                .filter((s) => s.type === "number")
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (sizes.includes(s.label)) {
                        setSizes(sizes.filter((x) => x !== s.label));
                      } else {
                        setSizes([...sizes, s.label]);
                      }
                    }}
                    className={`text-sm font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      sizes.includes(s.label)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              {availableSizes.filter((s) => s.type === "number").length ===
                0 && (
                <p className="text-xs text-muted-foreground">
                  No number sizes added yet.{" "}
                  <a href="/admin/sizes" className="text-primary underline">
                    Add sizes →
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Selected sizes preview */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
              <p className="text-xs font-bold text-muted-foreground">
                Selected:
              </p>
              {sizes.map((s) => (
                <span
                  key={s}
                  className="text-xs font-extrabold bg-primary/10 text-primary px-2.5 py-1 rounded-lg"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        {/* Colors */}
        <div className="border border-border rounded-xl p-4 space-y-4 bg-secondary/50">
          <p className="text-sm font-bold text-foreground">Colors</p>

          {/* Color search input */}
          <div ref={colorInputRef} className="relative">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Search and add colors
            </label>
            <Input
              placeholder="Type color name e.g. 'G' for Green, Grey..."
              value={colorInput}
              onChange={(e) => {
                const val = e.target.value;
                setColorInput(val);
                if (val.trim()) {
                  const filtered = availableColors.filter(
                    (c) =>
                      c.name.toLowerCase().includes(val.toLowerCase()) &&
                      !colors.includes(c.name),
                  );
                  setColorSuggestions(filtered);
                } else {
                  setColorSuggestions([]);
                }
              }}
              className="border-border bg-card"
            />

            {/* Suggestions */}
            {colorSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg z-50 max-h-48 overflow-y-auto"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {colorSuggestions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setColors([...colors, c.name]);
                      setColorInput("");
                      setColorSuggestions([]);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                  >
                    <div
                      className="w-6 h-6 rounded-lg border border-border shrink-0"
                      style={{ background: c.hex }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono ml-auto">
                      {c.hex}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {colorInput && colorSuggestions.length === 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-xl p-3 z-50"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-xs text-muted-foreground text-center">
                  No colors found.{" "}
                  <a href="/admin/colors" className="text-primary underline">
                    Add "{colorInput}" to colors →
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* All available colors — quick click */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              All colors — click to add
            </p>
            {availableColors.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No colors added yet.{" "}
                <a href="/admin/colors" className="text-primary underline">
                  Add colors →
                </a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (colors.includes(c.name)) {
                        setColors(colors.filter((x) => x !== c.name));
                      } else {
                        setColors([...colors, c.name]);
                      }
                    }}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                      colors.includes(c.name)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-border/50 shrink-0"
                      style={{ background: c.hex }}
                    />
                    {c.name}
                    {colors.includes(c.name) && (
                      <span className="text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected colors preview */}
          {colors.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-bold text-muted-foreground mb-2">
                Selected colors:
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((colorName) => {
                  const colorData = availableColors.find(
                    (c) => c.name === colorName,
                  );
                  return (
                    <div
                      key={colorName}
                      className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-1.5"
                    >
                      {colorData && (
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ background: colorData.hex }}
                        />
                      )}
                      <span className="text-xs font-extrabold text-foreground">
                        {colorName}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setColors(colors.filter((c) => c !== colorName))
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
