import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

import { Truck } from "lucide-react";
import DeliverySettingsForm from "@/components/admin/DeliverySettingsForm";

export default async function DeliverySettingsPage() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  let settings = await db.deliverySettings.findFirst();

  if (!settings) {
    settings = await db.deliverySettings.create({
      data: {
        insideDhaka: 60,
        outsideDhaka: 120,
        freeDeliveryMin: 2000,
      },
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Delivery settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set delivery charges for different areas
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Inside Dhaka",
            value: `৳${settings.insideDhaka}`,
            color: "bg-blue-50 border-blue-200 text-blue-800",
          },
          {
            label: "Outside Dhaka",
            value: `৳${settings.outsideDhaka}`,
            color: "bg-orange-50 border-orange-200 text-orange-800",
          },
          {
            label: "Free delivery from",
            value: `৳${settings.freeDeliveryMin}`,
            color: "bg-green-50 border-green-200 text-green-800",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`border rounded-2xl p-4 text-center ${color}`}
          >
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              {label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-foreground px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-base font-extrabold text-background">
            Update delivery charges
          </h2>
        </div>
        <div className="p-6">
          <DeliverySettingsForm settings={settings} />
        </div>
      </div>

      {/* How it works */}
      <div className="bg-secondary border border-border rounded-2xl p-5 space-y-3">
        <p className="text-sm font-extrabold text-foreground">
          How delivery charges work
        </p>
        <div className="space-y-2">
          {[
            `Customer selects district at checkout`,
            `If district is Dhaka → ৳${settings.insideDhaka} delivery charge`,
            `If district is outside Dhaka → ৳${settings.outsideDhaka} delivery charge`,
            `If order total is above ৳${settings.freeDeliveryMin} → free delivery anywhere`,
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
