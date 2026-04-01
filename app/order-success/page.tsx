import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="text-3xl font-medium text-foreground mb-3">
          Order placed!
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Thank you for your purchase. We'll send you a confirmation and notify
          you when your order ships.
        </p>
        <div className="bg-white border border-border rounded-2xl p-6 mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                What happens next?
              </p>
              <p className="text-xs text-muted-foreground">
                We'll process your order within 24 hours
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/account/orders">
            <Button className="w-full bg-primary text-primary-foreground rounded-xl py-6">
              View my orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              className="w-full border-border rounded-xl py-6"
            >
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
