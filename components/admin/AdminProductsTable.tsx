"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  images: string[];
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete product");
        return;
      }
      toast.success("Product deleted!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-border bg-card"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Featured
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-4 h-6 bg-muted rounded-full opacity-40" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium bg-secondary text-foreground px-2.5 py-1 rounded-lg">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-extrabold text-primary">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          product.stock === 0
                            ? "text-destructive"
                            : product.stock <= 10
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock === 0 && (
                        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                          Out
                        </span>
                      )}
                      {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {product.isFeatured ? (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/products/${product.slug}`}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-border rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-border rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border rounded-lg text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
              Delete product?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
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
