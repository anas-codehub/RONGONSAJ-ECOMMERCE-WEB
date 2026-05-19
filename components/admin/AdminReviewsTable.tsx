"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Trash2, Star } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  approved: boolean;
  createdAt: Date;
  user: { name: string | null; email: string | null; image: string | null };
  product: { name: string; slug: string; images: string[] };
}

export default function AdminReviewsTable({
  pending,
  approved,
}: {
  pending: Review[];
  approved: Review[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });
      if (!res.ok) {
        toast.error("Failed");
        return;
      }
      toast.success("Review approved!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed");
        return;
      }
      toast.success("Review rejected and deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed");
        return;
      }
      toast.success("Review deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const ReviewCard = ({
    review,
    isPending,
  }: {
    review: Review;
    isPending: boolean;
  }) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-border"
        style={{ background: "var(--secondary)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xs font-extrabold text-primary-foreground shrink-0">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name || "User"}
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              review.user.name?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <p className="text-sm font-extrabold text-foreground">
              {review.user.name || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">{review.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= review.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("en-BD")}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Product info */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-secondary rounded-xl">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
            {review.product.images[0] && (
              <Image
                src={review.product.images[0]}
                alt={review.product.name}
                fill
                className="object-contain p-0.5"
              />
            )}
          </div>
          <p className="text-sm font-bold text-foreground">
            {review.product.name}
          </p>
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            "{review.comment}"
          </p>
        )}

        {/* Review images */}
        {review.images.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {review.images.map((img, i) => (
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
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <>
              <button
                onClick={() => handleApprove(review.id)}
                disabled={loading === review.id}
                className="flex items-center gap-2 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex-1 justify-center"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                onClick={() => handleReject(review.id)}
                disabled={loading === review.id}
                className="flex items-center gap-2 bg-destructive text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-50 flex-1 justify-center"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => handleDelete(review.id)}
              disabled={loading === review.id}
              className="flex items-center gap-2 border border-border text-destructive text-xs font-bold px-4 py-2 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete review
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const reviews = activeTab === "pending" ? pending : approved;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-colors ${
            activeTab === "pending"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending
          {pending.length > 0 && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === "pending"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-colors ${
            activeTab === "approved"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Approved
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              activeTab === "approved"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-green-100 text-green-800"
            }`}
          >
            {approved.length}
          </span>
        </button>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-foreground font-bold">
            {activeTab === "pending"
              ? "No reviews pending approval"
              : "No approved reviews yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isPending={activeTab === "pending"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
