"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
  createdAt: Date;
  _count: { products: number };
}

export default function AdminCategoriesTable({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete category");
        return;
      }

      toast.success("Category deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-16 text-center">
        <p className="text-muted-foreground">No categories yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Name
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Slug
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Products
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Created
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">
                      {cat.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {cat._count.products} products
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(cat.createdAt).toLocaleDateString("en-BD")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-border text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(cat.id)}
                      disabled={cat._count.products > 0}
                      title={
                        cat._count.products > 0
                          ? "Cannot delete category with products"
                          : "Delete category"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete category?
            </DialogTitle>
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
