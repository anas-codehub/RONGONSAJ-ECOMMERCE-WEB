import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import SizesManager from "@/components/admin/SizesManager";

export default async function AdminSizesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const sizes = await db.size.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Sizes
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage available sizes for products
        </p>
      </div>
      <SizesManager sizes={sizes} />
    </div>
  );
}
