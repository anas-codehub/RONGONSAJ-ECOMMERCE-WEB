"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong!");
        return;
      }
      toast.success("Account created! Please sign in.");
      router.push("/sign-in");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — dark panel */}
      <div className="hidden md:flex bg-foreground flex-col justify-between p-12">
        <Link
          href="/"
          className="text-2xl font-extrabold text-background tracking-wider"
        >
          RONGO<span className="text-primary">N</span>SAAJ
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold text-background leading-tight mb-4">
            Join the
            <br />
            family!
          </h2>
          <p className="text-background/60 text-lg leading-relaxed">
            Create your account and start your fashion journey today.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Free delivery on orders over ৳2,000",
              "Exclusive member discounts",
              "Track your orders easily",
              "Save items to your wishlist",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-background/70 text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-background/30 text-sm">
          © 2026 Rongonsaaj · Dhaka, Bangladesh
        </p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link
              href="/"
              className="text-xl font-extrabold text-foreground tracking-wider md:hidden"
            >
              RONGO<span className="text-primary">N</span>SAAJ
            </Link>
            <h1 className="text-2xl font-extrabold text-foreground mt-4 mb-1">
              Create account
            </h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Full name
              </label>
              <Input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="border-border bg-secondary h-11"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Email address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="border-border bg-secondary h-11"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="border-border bg-secondary h-11"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Confirm password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="border-border bg-secondary h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-base font-bold mt-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
