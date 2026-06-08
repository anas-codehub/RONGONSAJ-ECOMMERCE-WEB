"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

export default function AdminCategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed");
        return;
      }
      toast.success(`Category "${data.name}" added!`);
      setNewName("");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed");
        return;
      }
      toast.success("Category deleted!");
      setDeleteId(null);
      router.refresh();
    } catch {
      setDeleteError("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    categoryId: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(categoryId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "category");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        toast.error("Upload failed");
        return;
      }

      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadData.url }),
      });
      if (!res.ok) {
        toast.error("Failed to save image");
        return;
      }

      toast.success("Category image updated!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploadingId(null);
      if (fileRefs.current[categoryId]) {
        fileRefs.current[categoryId]!.value = "";
      }
    }
  };

  return (
    <>
      {/* Add category */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <p className="text-sm font-extrabold text-foreground mb-3">
          Add new category
        </p>
        <div className="flex gap-3">
          <Input
            placeholder="Category name e.g. Male, Female, Kids..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border-border bg-secondary"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
          >
            {adding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </button>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border rounded-2xl overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-36 bg-secondary">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <ImagePlus className="h-8 w-8 text-muted-foreground/40 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">No image</p>
                  </div>
                </div>
              )}

              {/* Upload overlay */}
              <button
                onClick={() => fileRefs.current[cat.id]?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                {uploadingId === cat.id ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <div className="text-center">
                    <ImagePlus className="h-6 w-6 text-white mx-auto mb-1" />
                    <p className="text-xs text-white font-bold">
                      {cat.image ? "Change image" : "Add image"}
                    </p>
                  </div>
                )}
              </button>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => {
                  fileRefs.current[cat.id] = el;
                }}
                onChange={(e) => handleImageUpload(e, cat.id)}
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-extrabold text-foreground truncate">
                {cat.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cat._count.products} products
              </p>
              <button
                onClick={() => {
                  setDeleteError("");
                  setDeleteId(cat.id);
                }}
                disabled={cat._count.products > 0}
                className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 px-2 py-1.5 rounded-lg transition-colors mt-2 w-full justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                title={
                  cat._count.products > 0
                    ? "Cannot delete with products"
                    : "Delete"
                }
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={() => {
          setDeleteId(null);
          setDeleteError("");
        }}
      >
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete category?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-xl">
              {deleteError}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => {
                setDeleteId(null);
                setDeleteError("");
              }}
              className="px-4 py-2 text-sm font-bold border border-border rounded-xl hover:bg-secondary transition-colors text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-bold bg-destructive text-white rounded-xl hover:bg-destructive/90 transition-colors"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
