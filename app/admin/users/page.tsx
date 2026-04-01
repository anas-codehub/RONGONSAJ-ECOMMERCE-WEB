import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminUsersTable from "@/components/shared/AdminUsersTable";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {users.length} users total
          </p>
        </div>
        <AdminUsersTable users={users} currentUserId={session.user.id!} />
      </div>
    </div>
  );
}
