"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Star, ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "review");

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Upload failed");
          continue;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to leave a review");
      router.push("/sign-in");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment, images }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit review");
        return;
      }

      toast.success("Review submitted! Waiting for admin approval.");
      setSubmitted(true);
      setRating(0);
      setComment("");
      setImages([]);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="h-6 w-6 text-green-600 fill-green-600" />
        </div>
        <p className="text-sm font-extrabold text-green-800 mb-1">
          Review submitted!
        </p>
        <p className="text-xs text-green-700">
          Your review is waiting for admin approval and will appear soon.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-secondary border border-border rounded-2xl p-6 text-center">
        <p className="text-sm font-bold text-foreground mb-2">
          Sign in to leave a review
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Only verified buyers can review products
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="bg-primary text-primary-foreground text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      <h3 className="text-base font-extrabold text-foreground">
        Write a review
      </h3>

      {/* Star rating */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">
          Your rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hover || rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-1.5">
          Your review
          <span className="text-muted-foreground font-normal ml-1">
            (optional)
          </span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
          style={{ background: "var(--secondary)", color: "var(--foreground)" }}
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-1.5">
          Add photos
          <span className="text-muted-foreground font-normal ml-1">
            (up to 3 images)
          </span>
        </label>

        <div className="flex flex-wrap gap-3">
          {/* Uploaded images */}
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-border"
            >
              <Image
                src={img}
                alt={`Review image ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {images.length < 3 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors"
              style={{ background: "var(--secondary)" }}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Add photo
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-extrabold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
