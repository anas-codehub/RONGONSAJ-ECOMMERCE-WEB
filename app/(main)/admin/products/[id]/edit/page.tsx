import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        category: true,
        coupons: true,
      },
    }),
    db.category.findMany(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Edit product
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Update product details for{" "}
          <span className="font-bold text-foreground">{product.name}</span>
        </p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
