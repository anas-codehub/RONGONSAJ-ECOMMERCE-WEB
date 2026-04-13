"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, User } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  _count: { orders: number };
}

export default function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleRole = async (userId: string, currentRole: string) => {
    if (userId === currentUserId) {
      toast.error("You cannot change your own role!");
      return;
    }
    setUpdating(userId);
    try {
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        toast.error("Failed to update user role");
        return;
      }

      toast.success(`User is now ${newRole}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                User
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Role
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Orders
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Joined
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-secondary/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.name || "No name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {user._count.orders} orders
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-BD")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-xs h-8"
                    disabled={updating === user.id || user.id === currentUserId}
                    onClick={() => toggleRole(user.id, user.role)}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role === "ADMIN" ? "Remove admin" : "Make admin"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
