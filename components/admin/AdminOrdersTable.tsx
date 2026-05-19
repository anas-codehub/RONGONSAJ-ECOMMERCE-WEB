"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  trackingCode: string | null;
  steadfastId: number | null;
  user: { name: string | null; email: string | null };
  address: { city: string; district: string; phone: string };
  items: { id: string; quantity: number; product: { name: string } }[];
}

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()),
  );

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update order status");
        return;
      }
      toast.success("Order status updated!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const handleDispatch = async (orderId: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/dispatch`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Dispatch failed");
        return;
      }
      toast.success(`Dispatched! Tracking: ${data.trackingCode}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer or order ID..."
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
                  Order ID
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2 py-1 rounded-lg">
                      #{order.id}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-foreground">
                      {order.user.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.address.city}, {order.address.district}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <p
                          key={item.id}
                          className="text-xs text-muted-foreground"
                        >
                          {item.product.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-extrabold text-primary">
                      ৳{order.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-BD")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(val) => updateStatus(order.id, val)}
                      disabled={updating === order.id}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs border-border bg-card">
                        <SelectValue>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[s]}`}
                            >
                              {s}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Steadfast dispatch button */}
                    {order.status === "PROCESSING" && !order.trackingCode && (
                      <button
                        onClick={() => handleDispatch(order.id)}
                        disabled={updating === order.id}
                        className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-2"
                      >
                        {updating === order.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Truck className="h-3 w-3" />
                        )}
                        Dispatch via Steadfast
                      </button>
                    )}

                    {/* Show tracking code if dispatched */}
                    {order.trackingCode && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-mono">
                          📦 {order.trackingCode}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
