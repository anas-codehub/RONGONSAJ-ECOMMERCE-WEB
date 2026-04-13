import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminCouponsTable from "@/components/admin/AdminCouponsTable";
import { Plus, Tag } from "lucide-react";

export default async function AdminCouponsPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Coupons
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {coupons.length} coupons total
          </p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Add coupon
          </Button>
        </Link>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-foreground font-bold">No coupons yet</p>
        </div>
      ) : (
        <AdminCouponsTable coupons={coupons} />
      )}
    </div>
  );
}
