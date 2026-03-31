"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Use NextAuth signIn with credentials
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Signed in successfully!");
      router.push("/"); // Redirect to home or dashboard
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FAEEDA] mb-4">
            <Sparkles className="h-7 w-7 text-[#D85A30]" />
          </div>
          <h1 className="text-2xl font-medium text-[#412402]">Sign in</h1>
          <p className="text-[#854F0B] text-sm mt-1">Welcome back to RÊVE</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#FAC775] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#412402] block mb-1.5">
                Email address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="border-[#FAC775] focus:ring-[#D85A30]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#412402] block mb-1.5">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                className="border-[#FAC775] focus:ring-[#D85A30]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D85A30] hover:bg-[#993C1D] text-[#FAEEDA] py-6 rounded-xl text-base"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#854F0B] mt-6">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#D85A30] font-medium hover:underline"
            >
              Create account
            </Link>
          </p>

          <p className="text-center text-sm text-[#854F0B] mt-2">
            <Link
              href="/forgot-password"
              className="text-[#D85A30] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
