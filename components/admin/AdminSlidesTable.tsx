"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminSlidesTable({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/slides/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete slide");
        return;
      }
      toast.success("Slide deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) {
        toast.error("Failed to update slide");
        return;
      }
      toast.success(isActive ? "Slide hidden!" : "Slide visible!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setToggling(null);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-16 text-center">
        <p className="text-muted-foreground">No slides yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first hero slide to show on the homepage
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`bg-white border border-border rounded-2xl p-4 flex items-center gap-4 ${
              !slide.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Image preview */}
            <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {slide.title}
              </p>
              {slide.subtitle && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground">
                  Order: {slide.order}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    slide.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {slide.isActive ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 border-border"
                disabled={toggling === slide.id}
                onClick={() => toggleActive(slide.id, slide.isActive)}
                title={slide.isActive ? "Hide slide" : "Show slide"}
              >
                {slide.isActive ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 border-border text-destructive hover:text-destructive"
                onClick={() => setDeleteId(slide.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete slide?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
