import CouponForm from "@/components/admin/CouponForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewCouponPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-medium text-foreground mb-8">
          Add new coupon
        </h1>
        <CouponForm />
      </div>
    </div>
  );
}
