import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Users
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {users.length} users total
        </p>
      </div>
      <AdminUsersTable users={users} currentUserId={session.user.id!} />
    </div>
  );
}
