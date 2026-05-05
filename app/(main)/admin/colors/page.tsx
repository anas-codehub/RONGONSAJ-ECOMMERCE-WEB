import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ColorsManager from "@/components/admin/ColorsManager";

export default async function AdminColorsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const colors = await db.color.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Colors
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage available colors for products
        </p>
      </div>
      <ColorsManager colors={colors} />
    </div>
  );
}
