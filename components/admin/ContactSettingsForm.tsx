"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

interface Settings {
  whatsappNumber: string;
  facebookPage: string;
  messengerLink: string;
  phone: string;
}

export default function ContactSettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    whatsappNumber: settings.whatsappNumber || "",
    facebookPage: settings.facebookPage || "",
    messengerLink: settings.messengerLink || "",
    phone: settings.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Failed to save");
        return;
      }
      toast.success("Settings saved!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-extrabold text-foreground block mb-1.5">
          WhatsApp number
        </label>
        <Input
          value={form.whatsappNumber}
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          placeholder="8801XXXXXXXXX (with country code)"
          className="border-border bg-secondary"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Include country code e.g. 8801711234567
        </p>
      </div>

      <div>
        <label className="text-sm font-extrabold text-foreground block mb-1.5">
          Facebook page URL
        </label>
        <Input
          value={form.facebookPage}
          onChange={(e) => setForm({ ...form, facebookPage: e.target.value })}
          placeholder="https://facebook.com/yourpage"
          className="border-border bg-secondary"
        />
      </div>

      <div>
        <label className="text-sm font-extrabold text-foreground block mb-1.5">
          Messenger link
        </label>
        <Input
          value={form.messengerLink}
          onChange={(e) => setForm({ ...form, messengerLink: e.target.value })}
          placeholder="https://m.me/yourpage"
          className="border-border bg-secondary"
        />
      </div>

      {/* <div>
        <label className="text-sm font-extrabold text-foreground block mb-1.5">
          Phone number (for call button)
        </label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="01XXXXXXXXX"
          className="border-border bg-secondary"
        />
      </div> */}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-extrabold hover:bg-primary/90 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
