import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-muted" />
              <span className="text-xl font-medium text-primary-foreground tracking-widest">
                RONGONSAAJ
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Handpicked fashion pieces that celebrate your unique style every
              single day.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-sm font-medium text-primary-foreground mb-4">
              Shop
            </p>
            <ul className="space-y-3">
              {[
                { label: "All products", href: "/products" },
                { label: "New arrivals", href: "/products?sort=newest" },
                { label: "Featured", href: "/products?featured=true" },
                { label: "Sale", href: "/products?sale=true" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-sm font-medium text-primary-foreground mb-4">
              Account
            </p>
            <ul className="space-y-3">
              {[
                { label: "Sign in", href: "/sign-in" },
                { label: "Create account", href: "/sign-up" },
                { label: "My orders", href: "/account/orders" },
                { label: "My profile", href: "/account/profile" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-medium text-primary-foreground mb-4">
              Help
            </p>
            <ul className="space-y-3">
              {[
                { label: "Contact us", href: "/contact" },
                { label: "Shipping policy", href: "/shipping" },
                { label: "Return policy", href: "/returns" },
                { label: "Privacy policy", href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 RONGONSAAJ · Dhaka, Bangladesh · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <p className="text-xs text-muted-foreground">
              Payments secured by SSLCommerz
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 bg-muted/20 rounded text-muted-foreground text-xs flex items-center justify-center">
                VISA
              </div>
              <div className="w-8 h-5 bg-muted/20 rounded text-muted-foreground text-xs flex items-center justify-center">
                MC
              </div>
              <div className="w-8 h-5 bg-muted/20 rounded text-muted-foreground text-xs flex items-center justify-center">
                bKash
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
