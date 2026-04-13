import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminSlidesTable from "@/components/admin/AdminSlidesTable";
import { Plus, ImageIcon } from "lucide-react";

export default async function AdminSlidesPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const slides = await db.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Hero slides
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {slides.length} slides total
          </p>
        </div>
        <Link href="/admin/slides/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Add slide
          </Button>
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-foreground font-bold">No slides yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Add slides to show on the homepage banner
          </p>
          <Link href="/admin/slides/new">
            <Button className="bg-primary text-primary-foreground rounded-xl">
              Add slide
            </Button>
          </Link>
        </div>
      ) : (
        <AdminSlidesTable slides={slides} />
      )}
    </div>
  );
}
