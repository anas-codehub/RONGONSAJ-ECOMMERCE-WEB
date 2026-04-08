import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import AdminCategoriesTable from "@/components/admin/AdminCategoriesTable";

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-foreground">Categories</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {categories.length} categories total
            </p>
          </div>
          <Link href="/admin/categories/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add category
            </Button>
          </Link>
        </div>
        <AdminCategoriesTable categories={categories} />
      </div>
    </div>
  );
}
