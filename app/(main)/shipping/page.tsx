import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
            Delivery info
          </p>
          <h1 className="text-4xl font-extrabold text-background tracking-tight mb-4">
            Shipping policy
          </h1>
          <p className="text-background/60 text-lg max-w-md mx-auto">
            Everything you need to know about our delivery process.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-8">
        {/* Delivery areas */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Delivery areas
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We currently deliver all across Bangladesh including Dhaka,
            Chittagong, Sylhet, Rajshahi, Khulna, and all other major cities and
            districts.
          </p>
        </div>

        {/* Delivery time */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Delivery time
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { area: "Dhaka city", time: "1–2 business days" },
              { area: "Outside Dhaka", time: "3–5 business days" },
              { area: "Remote areas", time: "5–7 business days" },
            ].map(({ area, time }) => (
              <div
                key={area}
                className="flex justify-between items-center py-3 border-b border-border last:border-0"
              >
                <span className="text-sm font-medium text-foreground">
                  {area}
                </span>
                <span className="text-sm font-bold text-primary">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery charges */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Delivery charges
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                Orders under ৳2,000
              </span>
              <span className="text-sm font-bold text-foreground">৳100</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-foreground">
                Orders over ৳2,000
              </span>
              <span className="text-sm font-bold text-green-600">
                Free delivery
              </span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold text-foreground">
              Payment method
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We currently accept{" "}
            <span className="font-bold text-foreground">Cash on Delivery</span>{" "}
            only. Please have the exact amount ready when our delivery person
            arrives at your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
