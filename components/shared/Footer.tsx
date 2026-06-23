import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="Rongonsaaj"
                width={500}
                height={260}
                className="object-contain h-24 w-auto"
                priority
              />
            </div>
            <p className="text-sm text-background/50 leading-relaxed mb-4">
              Fashion for every chapter of your life. Curated with love from
              Dhaka, Bangladesh.
            </p>
            <div className="flex gap-3">
              {["F", "I", "T"].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center text-background/50 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-sm font-bold text-background mb-4 uppercase tracking-widest">
              Shop
            </p>
            <ul className="space-y-3">
              {[
                { label: "All products", href: "/products" },
                { label: "New arrivals", href: "/products?sort=newest" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-sm font-bold text-background mb-4 uppercase tracking-widest">
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
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-bold text-background mb-4 uppercase tracking-widest">
              Help
            </p>
            <ul className="space-y-3">
              {[
                { label: "Contact us", href: "/contact" },
                { label: "Shipping policy", href: "/shipping" },
                { label: "Return policy", href: "/returns" },
                { label: "Privacy policy", href: "/privacy" },
                { label: "FAQ", href: "/faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2026 Rongonsaaj · Dhaka, Bangladesh · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
