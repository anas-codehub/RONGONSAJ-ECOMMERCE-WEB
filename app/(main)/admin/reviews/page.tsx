import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminReviewsTable from "@/components/admin/AdminReviewsTable";
import { Star } from "lucide-react";

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const [pending, approved] = await Promise.all([
    db.review.findMany({
      where: { approved: false },
      include: {
        user: { select: { name: true, email: true, image: true } },
        product: { select: { name: true, slug: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.review.findMany({
      where: { approved: true },
      include: {
        user: { select: { name: true, email: true, image: true } },
        product: { select: { name: true, slug: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Reviews
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pending.length} pending approval · {approved.length} approved
          </p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl">
            <Star className="h-4 w-4" />
            <span className="text-sm font-extrabold">
              {pending.length} reviews waiting
            </span>
          </div>
        )}
      </div>
      <AdminReviewsTable pending={pending} approved={approved} />
    </div>
  );
}
