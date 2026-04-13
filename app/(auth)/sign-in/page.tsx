"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password!");
        return;
      }
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left — terracotta panel */}
      <div className="hidden md:flex bg-primary flex-col justify-between p-12">
        <Link
          href="/"
          className="text-2xl font-extrabold text-primary-foreground tracking-wider"
        >
          RONGO<span className="text-foreground">N</span>SAAJ
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold text-primary-foreground leading-tight mb-4">
            Welcome
            <br />
            back!
          </h2>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            Sign in to your account and continue your fashion journey.
          </p>
        </div>
        <p className="text-primary-foreground/40 text-sm">
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
              Sign in
            </h1>
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary font-semibold hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
