"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { products: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  children: SubCategory[];
  _count: { products: number };
}

export default function AdminCategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [subName, setSubName] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
        setDeleteError(data.error || "Failed to delete");
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

  const handleAddSub = async (parentId: string) => {
    if (!subName.trim()) return;
    setAddingLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName.trim(), parentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add subcategory");
        return;
      }
      toast.success(`Subcategory "${data.name}" added!`);
      setSubName("");
      setAddingSubFor(null);
      if (!expanded.includes(parentId)) {
        setExpanded([...expanded, parentId]);
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setAddingLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="divide-y divide-border">
          {categories.map((cat) => (
            <div key={cat.id}>
              {/* Main category row */}
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-secondary/50 transition-colors">
                {/* Expand toggle */}
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0"
                >
                  {cat.children.length > 0 ? (
                    expanded.includes(cat.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    <span className="w-4" />
                  )}
                </button>

                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FolderOpen className="h-4 w-4 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-foreground">
                    {cat.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">
                      {cat.slug}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cat._count.products} products
                    </span>
                    {cat.children.length > 0 && (
                      <span className="text-xs font-bold text-primary">
                        {cat.children.length} subcategories
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAddingSubFor(addingSubFor === cat.id ? null : cat.id);
                      setSubName("");
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add sub
                  </button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 border-border rounded-lg text-destructive hover:text-destructive"
                    onClick={() => {
                      setDeleteError("");
                      setDeleteId(cat.id);
                    }}
                    disabled={
                      cat._count.products > 0 || cat.children.length > 0
                    }
                    title={
                      cat.children.length > 0
                        ? "Delete subcategories first"
                        : cat._count.products > 0
                          ? "Cannot delete with products"
                          : "Delete"
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Add subcategory input */}
              {addingSubFor === cat.id && (
                <div className="px-5 py-3 bg-primary/5 border-t border-border flex items-center gap-3">
                  <div className="w-7 shrink-0" />
                  <div className="w-8 shrink-0" />
                  <Input
                    placeholder={`Add subcategory under "${cat.name}"...`}
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="border-border bg-card flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSub(cat.id);
                      if (e.key === "Escape") setAddingSubFor(null);
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddSub(cat.id)}
                    disabled={addingLoading || !subName.trim()}
                    className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {addingLoading ? "Adding..." : "Add"}
                  </button>
                  <button
                    onClick={() => setAddingSubFor(null)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Subcategories */}
              {expanded.includes(cat.id) && cat.children.length > 0 && (
                <div className="border-t border-border">
                  {cat.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 px-5 py-3 bg-secondary/30 hover:bg-secondary/60 transition-colors border-b border-border last:border-0"
                    >
                      <div className="w-7 shrink-0" />
                      <div className="w-px h-6 bg-border shrink-0 ml-3" />
                      <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">
                          {sub.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground font-mono">
                            {sub.slug}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {sub._count.products} products
                          </span>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 border-border rounded-lg text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeleteError("");
                          setDeleteId(sub.id);
                        }}
                        disabled={sub._count.products > 0}
                        title={
                          sub._count.products > 0
                            ? "Cannot delete with products"
                            : "Delete"
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
            <Button
              variant="outline"
              onClick={() => {
                setDeleteId(null);
                setDeleteError("");
              }}
              className="border-border rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
