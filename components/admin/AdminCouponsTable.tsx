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

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

export default function AdminCouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Failed to delete coupon");
        return;
      }
      toast.success("Coupon deleted!");
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
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Discount
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Expires
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-bold text-foreground bg-secondary px-3 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-extrabold text-primary">
                      {coupon.discount}
                      {coupon.isPercent ? "%" : "৳"} off
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("en-BD")
                        : "No expiry"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-border rounded-lg text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(coupon.id)}
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
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete coupon?
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
