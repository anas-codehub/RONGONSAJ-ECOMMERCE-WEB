"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
            Get in touch
          </p>
          <h1 className="text-4xl font-extrabold text-background tracking-tight mb-4">
            Contact us
          </h1>
          <p className="text-background/60 text-lg max-w-md mx-auto">
            Have a question or need help? We're here for you.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            {[
              {
                icon: Phone,
                label: "Phone",
                value: "+880 1XXXXXXXXX",
                sub: "Sat–Thu, 10am–8pm",
              },
              {
                icon: Mail,
                label: "Email",
                value: "support@rongonsaaj.com",
                sub: "We reply within 24 hours",
              },
              {
                icon: MapPin,
                label: "Address",
                value: "Dhaka, Bangladesh",
                sub: "Visit us anytime",
              },
              {
                icon: Clock,
                label: "Business hours",
                value: "Sat–Thu: 10am–8pm",
                sub: "Friday: closed",
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-extrabold text-foreground mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">
                      Your name
                    </label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Full name"
                      required
                      className="border-border bg-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-1.5">
                      Email address
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      required
                      className="border-border bg-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Subject
                  </label>
                  <Input
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    required
                    className="border-border bg-secondary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">
                    Message
                  </label>
                  <Textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us more..."
                    rows={5}
                    required
                    className="border-border bg-secondary resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 font-bold"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {loading ? "Sending..." : "Send message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
