import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import AdminProductsTable from "@/components/admin/AdminProductsTable";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-foreground">Products</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {products.length} products total
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </Link>
        </div>

        <AdminProductsTable products={products} categories={categories} />
      </div>
    </div>
  );
}
