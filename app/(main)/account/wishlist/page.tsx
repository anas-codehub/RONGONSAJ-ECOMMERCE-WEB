import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const wishlist = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = wishlist.map((w) => w.product);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-medium text-foreground">My wishlist</h1>
          <span className="text-muted-foreground text-lg">
            ({products.length} {products.length === 1 ? "item" : "items"})
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-border rounded-2xl">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted" />
            <p className="text-lg font-medium text-foreground mb-1">
              Your wishlist is empty
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Save products you love by clicking the heart icon
            </p>
            <Link href="/products">
              <Button className="bg-primary text-primary-foreground rounded-xl">
                Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
