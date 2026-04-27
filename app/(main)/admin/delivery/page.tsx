import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DeliverySettingsForm from "@/components/admin/DeliverySettingsForm";
import { Truck } from "lucide-react";
import { DELIVERY_ZONES } from "@/lib/districts";

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
        subDhaka: 120,
        outsideDhaka: 150,
      },
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Delivery settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set delivery charges for different zones
        </p>
      </div>

      {/* Current charges */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Dhaka",
            value: `৳${settings.insideDhaka}`,
            sub: "Main Dhaka city",
            color: "bg-green-50 border-green-200 text-green-800",
          },
          {
            label: "Sub Dhaka",
            value: `৳${settings.subDhaka}`,
            sub: "Gazipur, Narayanganj etc.",
            color: "bg-blue-50 border-blue-200 text-blue-800",
          },
          {
            label: "Outside Dhaka",
            value: `৳${settings.outsideDhaka}`,
            sub: "All other districts",
            color: "bg-orange-50 border-orange-200 text-orange-800",
          },
        ].map(({ label, value, sub, color }) => (
          <div
            key={label}
            className={`border rounded-2xl p-4 text-center ${color}`}
          >
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              {label}
            </p>
            <p className="text-2xl font-extrabold mt-1">{value}</p>
            <p className="text-xs opacity-60 mt-1">{sub}</p>
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

      {/* District list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary">
          <h2 className="text-sm font-extrabold text-foreground">
            District zone reference
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Which districts belong to which zone
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dhaka */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-sm font-extrabold text-foreground">Dhaka</p>
            </div>
            <div className="space-y-1">
              {DELIVERY_ZONES.dhaka.districts.map((d) => (
                <p
                  key={d}
                  className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg"
                >
                  {d}
                </p>
              ))}
            </div>
          </div>

          {/* Sub Dhaka */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <p className="text-sm font-extrabold text-foreground">
                Sub Dhaka
              </p>
            </div>
            <div className="space-y-1">
              {DELIVERY_ZONES.subDhaka.districts.map((d) => (
                <p
                  key={d}
                  className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg"
                >
                  {d}
                </p>
              ))}
            </div>
          </div>

          {/* Outside Dhaka */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <p className="text-sm font-extrabold text-foreground">
                Outside Dhaka
              </p>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {DELIVERY_ZONES.outsideDhaka.districts.map((d) => (
                <p
                  key={d}
                  className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg"
                >
                  {d}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
