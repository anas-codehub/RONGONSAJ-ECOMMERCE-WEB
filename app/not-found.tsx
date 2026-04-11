import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[120px] md:text-[160px] font-medium text-secondary leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-medium text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-border px-8 py-6 rounded-xl"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse products
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Or try one of these pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "New arrivals", href: "/products?sort=newest" },
              { label: "Sale", href: "/products?sale=true" },
              { label: "My orders", href: "/account/orders" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href}>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-muted transition-colors cursor-pointer">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
