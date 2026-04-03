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

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: Date;
  user: { name: string | null; email: string | null };
  address: { city: string; district: string; phone: string };
  items: { id: string; quantity: number; product: { name: string } }[];
}

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

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

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-border rounded-2xl p-16 text-center">
        <p className="text-muted-foreground">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
              Order ID
            </th>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Items
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Total
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-secondary/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded-lg">
                    #{order.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-foreground">
                    {order.user.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.address.city}, {order.address.district}
                  </p>
                </td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-primary">
                    ৳{order.total.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Select
                    defaultValue={order.status}
                    onValueChange={(val) => updateStatus(order.id, val)}
                    disabled={updating === order.id}
                  >
                    <SelectTrigger className="w-36 h-8 text-xs border-border">
                      <SelectValue>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s]}`}
                          >
                            {s}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
