"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Tag } from "lucide-react";
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

  if (coupons.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-16 text-center">
        <Tag className="h-10 w-10 mx-auto mb-3 text-muted" />
        <p className="text-muted-foreground">No coupons yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Code
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Discount
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                  Expires
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
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
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-foreground bg-secondary px-3 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-primary">
                      {coupon.discount}
                      {coupon.isPercent ? "%" : "৳"} off
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("en-BD")
                        : "No expiry"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-border text-destructive hover:text-destructive"
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
        <DialogContent className="border-border">
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
