import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import AdminCouponsTable from "@/components/admin/AdminCouponsTable";

export default async function AdminCouponsPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-foreground">Coupons</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {coupons.length} coupons total
            </p>
          </div>
          <Link href="/admin/coupons/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add coupon
            </Button>
          </Link>
        </div>
        <AdminCouponsTable coupons={coupons} />
      </div>
    </div>
  );
}
