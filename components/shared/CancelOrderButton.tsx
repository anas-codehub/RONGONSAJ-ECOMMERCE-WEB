"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to cancel order");
        return;
      }

      toast.success("Order cancelled successfully!");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-xl transition-colors"
      >
        <X className="h-3.5 w-3.5" />
        Cancel order
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Cancel this order?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This will cancel your order and restore your items to stock. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-secondary rounded-xl p-4 my-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-extrabold text-foreground">
                Order #{orderId}
              </span>
              <br />
              Since this is a Cash on Delivery order, no payment will be
              charged.
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-bold text-foreground border border-border rounded-xl hover:bg-secondary transition-colors"
            >
              Keep order
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-white bg-destructive rounded-xl hover:bg-destructive/90 transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {loading ? "Cancelling..." : "Yes, cancel"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
