"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

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
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FAEEDA] mb-4">
            <Sparkles className="h-7 w-7 text-[#D85A30]" />
          </div>
          <h1 className="text-2xl font-medium text-[#412402]">
            Create account
          </h1>
          <p className="text-[#854F0B] text-sm mt-1">
            Join RONGONSAAJ and start shopping
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#FAC775] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#412402] block mb-1.5">
                Full name
              </label>
              <Input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="border-[#FAC775] focus:ring-[#D85A30]"
              />
            </div>

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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                className="border-[#FAC775] focus:ring-[#D85A30]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#412402] block mb-1.5">
                Confirm password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
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
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#854F0B] mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-[#D85A30] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
