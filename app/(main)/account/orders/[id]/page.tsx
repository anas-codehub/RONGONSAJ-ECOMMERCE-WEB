import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import InvoiceButton from "@/components/shared/InvoiceButton";
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Circle,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const statusSteps = [
  { key: "PENDING", label: "Order placed", icon: Clock },
  { key: "PROCESSING", label: "Processing", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
      address: true,
      coupon: true,
      user: true,
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back button */}
        <Link href="/account/orders">
          <Button
            variant="outline"
            className="border-border rounded-xl mb-6 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to orders
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Order details
            </h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              #{order.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[order.status]}`}
            >
              {order.status}
            </span>
            <InvoiceButton
              order={{
                ...order,
                user: {
                  name: order.user.name,
                  email: order.user.email,
                },
              }}
            />
          </div>
        </div>

        {/* Order status timeline */}
        {!isCancelled ? (
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-extrabold text-foreground mb-6 uppercase tracking-wider">
              Order status
            </h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-500"
                style={{
                  width:
                    currentStepIndex >= 0
                      ? `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
                      : "0%",
                }}
              />

              <div className="relative flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center gap-2 w-20"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border-2 border-border text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <p
                        className={`text-xs font-bold text-center leading-tight ${
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <XCircle className="h-8 w-8 text-destructive shrink-0" />
            <div>
              <p className="font-extrabold text-destructive">Order cancelled</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                This order has been cancelled. Stock has been restocked.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left — items + summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Order items */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
                  Items ordered ({order.items.length})
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-4 flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-6 h-10 bg-muted rounded-full opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`}>
                        <p className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {item.product.name}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-extrabold text-foreground shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="px-6 py-4 bg-secondary space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">
                    ৳
                    {order.items
                      .reduce((acc, i) => acc + i.price * i.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({order.coupon.code})</span>
                    <span>-{order.coupon.discount}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator className="bg-border my-2" />
                <div className="flex justify-between font-extrabold text-foreground">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-extrabold text-foreground mb-3 uppercase tracking-wider">
                Payment method
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Circle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Cash on delivery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pay when your order arrives
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — address + order info */}
          <div className="space-y-6">
            {/* Delivery address */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery address
              </h2>
              <div className="space-y-1.5 text-sm">
                <p className="font-bold text-foreground">
                  {order.address.fullName}
                </p>
                <p className="text-muted-foreground">{order.address.street}</p>
                <p className="text-muted-foreground">
                  {order.address.city}, {order.address.district}
                </p>
                <p className="text-muted-foreground">{order.address.phone}</p>
              </div>
            </div>

            {/* Order info */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wider">
                Order info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    #{order.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium text-foreground">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </div>

            {/* Need help */}
            <div className="bg-secondary border border-border rounded-2xl p-5">
              <p className="text-sm font-extrabold text-foreground mb-1">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Having an issue with your order? Contact us and we'll sort it
                out.
              </p>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full border-border rounded-xl text-sm font-bold"
                >
                  Contact support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
