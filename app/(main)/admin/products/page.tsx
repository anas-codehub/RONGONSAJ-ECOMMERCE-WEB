import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { Plus, Package } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: {
        category: true,
        coupons: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {products.length} products total
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <p className="text-foreground font-bold">No products yet</p>
          <p className="text-muted-foreground text-sm mt-1 mb-4">
            Add your first product to get started
          </p>
          <Link href="/admin/products/new">
            <Button className="bg-primary text-primary-foreground rounded-xl">
              Add product
            </Button>
          </Link>
        </div>
      ) : (
        <AdminProductsTable products={products} categories={categories} />
      )}
    </div>
  );
}
