"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SlideForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    order: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: images[0],
          title: form.title,
          subtitle: form.subtitle,
          buttonText: form.buttonText,
          buttonLink: form.buttonLink,
          order: parseInt(form.order),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create slide");
        return;
      }

      toast.success("Slide created!");
      router.push("/admin/slides");
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
        {/* Image upload */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Slide image
          </label>
          <ImageUpload images={images} onChange={setImages} />
          <p className="text-xs text-muted-foreground mt-1">
            Best size: 1920×600px (landscape). Will be responsive on mobile.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Title
          </label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. New collection 2026"
            required
            className="border-border"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Subtitle (optional)
          </label>
          <Input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="e.g. Discover our latest arrivals"
            className="border-border"
          />
        </div>

        {/* Button */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Button text (optional)
            </label>
            <Input
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
              placeholder="e.g. Shop now"
              className="border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Button link (optional)
            </label>
            <Input
              name="buttonLink"
              value={form.buttonLink}
              onChange={handleChange}
              placeholder="e.g. /products"
              className="border-border"
            />
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">
            Display order
          </label>
          <Input
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="border-border w-32"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lower number = shows first
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
          {loading ? "Creating..." : "Create slide"}
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
