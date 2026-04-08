"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch(`/api/wishlist/${productId}`)
      .then((res) => res.json())
      .then((data) => setWishlisted(data.wishlisted));
  }, [productId, session?.user?.id]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to add to wishlist");
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      setWishlisted(data.wishlisted);
      toast.success(
        data.wishlisted ? "Added to wishlist!" : "Removed from wishlist!",
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`transition-all duration-200 ${className}`}
    >
      <Heart
        className={`h-4 w-4 transition-all duration-200 ${
          wishlisted
            ? "fill-red-500 text-red-500 scale-110"
            : "text-muted-foreground hover:text-red-500"
        }`}
      />
    </button>
  );
}
