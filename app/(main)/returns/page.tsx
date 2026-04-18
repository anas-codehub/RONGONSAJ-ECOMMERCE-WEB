import { RefreshCw, CheckCircle, XCircle, Phone } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
            Returns
          </p>
          <h1 className="text-4xl font-extrabold text-background tracking-tight mb-4">
            Return policy
          </h1>
          <p className="text-background/60 text-lg max-w-md mx-auto">
            Not happy with your order? We'll make it right.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              7-day return policy
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You can return any item within 7 days of delivery. Items must be
            unused, unwashed, and in their original condition with tags
            attached.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Eligible for return
            </h2>
          </div>
          <div className="space-y-2">
            {[
              "Item received in wrong size or color",
              "Item is damaged or defective",
              "Item is different from what was shown",
              "Item is unused and in original condition",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Not eligible for return
            </h2>
          </div>
          <div className="space-y-2">
            {[
              "Item has been worn or washed",
              "Tags have been removed",
              "More than 7 days since delivery",
              "Item damaged by customer",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              How to return
            </h2>
          </div>
          <div className="space-y-3">
            {[
              "Contact us within 7 days of receiving your order",
              "Share your order ID and reason for return",
              "We'll arrange pickup or ask you to send the item",
              "Refund or exchange processed within 3–5 business days",
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
