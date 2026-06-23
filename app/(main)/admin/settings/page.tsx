import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ContactSettingsForm from "@/components/admin/ContactSettingsForm";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  let settings = await db.siteSettings.findFirst();
  if (!settings) {
    settings = await db.siteSettings.create({
      data: { id: "settings" },
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Site settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage contact links and social media
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-foreground px-6 py-4 flex items-center gap-3">
          <Settings className="h-4 w-4 text-primary" />
          <h2 className="text-base font-extrabold text-background">
            Contact & social links
          </h2>
        </div>
        <div className="p-6">
          <ContactSettingsForm settings={settings} />
        </div>
      </div>
    </div>
  );
}
