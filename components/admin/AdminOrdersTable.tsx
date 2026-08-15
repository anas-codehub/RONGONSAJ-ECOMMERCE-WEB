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
import {
  Search,
  Loader2,
  Truck,
  CheckCheck,
  Check,
  Pencil,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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
  isRead: boolean;
  createdAt: Date;
  trackingCode: string | null;
  steadfastId: number | null;
  user: { name: string | null; email: string | null };
  address: { street: string; city?: string; district: string; phone: string };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      sku: string | null;
    };
  }[];
}

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    district: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());

    const matchesDate = selectedDate
      ? new Date(o.createdAt).toLocaleDateString("en-CA") === selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  const unreadCount = filtered.filter((o) => !o.isRead).length;

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }
      toast.success("Status updated!");
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

  const handleMarkRead = async (orderId: string) => {
    try {
      await fetch("/api/admin/orders/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      router.refresh();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/admin/orders/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      toast.success("All orders marked as read!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleSaveAddress = async (orderId: string) => {
    setSavingAddress(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: editAddress }),
      });
      if (!res.ok) {
        toast.error("Failed to update address");
        return;
      }
      toast.success("Address updated!");
      setEditingOrder(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-50]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-border bg-card"
          />
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-border bg-card w-40"
            max={new Date().toLocaleDateString("en-CA")}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate("")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mark all read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {/* Date summary */}
      {selectedDate && (
        <div className="bg-secondary border border-border rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">
            Orders for{" "}
            {new Date(selectedDate).toLocaleDateString("en-BD", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <span className="text-sm font-extrabold text-primary">
            {filtered.length} orders · ৳
            {filtered
              .filter((o) => o.status !== "CANCELLED")
              .reduce((acc, o) => acc + o.total, 0)
              .toLocaleString()}{" "}
            total
          </span>
        </div>
      )}

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
                <th className="text-left text-xs font-bold text-muted-foreground px-5 py-3 uppercase tracking-wider">
                  Read
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-secondary/50 transition-colors ${
                      !order.isRead
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {!order.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                        <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2 py-1 rounded-lg">
                          #{order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground">
                        {order.user.name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.user.email}
                      </p>

                      {editingOrder === order.id ? (
                        // Edit form
                        <div className="mt-2 space-y-2 bg-secondary rounded-xl p-3 border border-border">
                          <input
                            value={editAddress.fullName}
                            onChange={(e) =>
                              setEditAddress({
                                ...editAddress,
                                fullName: e.target.value,
                              })
                            }
                            placeholder="Full name"
                            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
                          />
                          <input
                            value={editAddress.phone}
                            onChange={(e) =>
                              setEditAddress({
                                ...editAddress,
                                phone: e.target.value,
                              })
                            }
                            placeholder="Phone"
                            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
                          />
                          <input
                            value={editAddress.street}
                            onChange={(e) =>
                              setEditAddress({
                                ...editAddress,
                                street: e.target.value,
                              })
                            }
                            placeholder="Street address"
                            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
                          />
                          <input
                            value={editAddress.district}
                            onChange={(e) =>
                              setEditAddress({
                                ...editAddress,
                                district: e.target.value,
                              })
                            }
                            placeholder="District"
                            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveAddress(order.id)}
                              disabled={savingAddress}
                              className="flex-1 text-xs font-bold bg-primary text-primary-foreground py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                              {savingAddress ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingOrder(null)}
                              className="flex-1 text-xs font-bold border border-border text-foreground py-1.5 rounded-lg hover:bg-secondary transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Address display
                        <div className="mt-1">
                          <p className="text-xs text-muted-foreground">
                            📍 {order.address.street}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.address.district}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📞 {order.address.phone}
                          </p>
                          <button
                            onClick={() => {
                              setEditingOrder(order.id);
                              setEditAddress({
                                fullName: order.user.name || "",
                                phone: order.address.phone,
                                street: order.address.street,
                                district: order.address.district,
                              });
                            }}
                            className="flex items-center gap-1 text-xs text-primary hover:underline mt-1 font-bold"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit address
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2"
                          >
                            {item.product.sku && (
                              <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                {item.product.sku}
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {item.product.name} × {item.quantity}
                              <span className="text-primary font-bold ml-1">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-extrabold text-primary">
                        ৳{order.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-BD")}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString("en-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
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

                      {/* Steadfast dispatch */}
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

                      {order.trackingCode && (
                        <div className="mt-2">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-mono">
                            📦 {order.trackingCode}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {!order.isRead ? (
                        <button
                          onClick={() => handleMarkRead(order.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors border border-primary/20"
                        >
                          <Check className="h-3 w-3" />
                          Mark read
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                          Read
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
