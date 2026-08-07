"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Camera, User, Lock, Check } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [nameLoading, setNameLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(session?.user?.name || "");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const userImage = session?.user?.image;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "U";

  // Upload profile picture
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "profile");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        toast.error(uploadData.error || "Upload failed");
        return;
      }

      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadData.url }),
      });

      if (!res.ok) {
        toast.error("Failed to update profile picture");
        return;
      }

      await update({ image: uploadData.url });
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setImageLoading(false);
    }
  };

  // Update name
  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setNameLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        toast.error("Failed to update name");
        return;
      }

      await update({ name });
      toast.success("Name updated!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setNameLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-foreground mb-8 tracking-tight">
          My profile
        </h1>

        {/* Profile picture */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-extrabold text-foreground mb-5 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Profile picture
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-primary">
                      {userInitial}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={imageLoading}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                {imageLoading ? (
                  <Loader2 className="h-3.5 w-3.5 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-foreground">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {session?.user?.email}
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={imageLoading}
                className="text-xs text-primary font-semibold hover:underline mt-2 block"
              >
                {imageLoading ? "Uploading..." : "Change photo"}
              </button>
            </div>
          </div>
        </div>

        {/* Update name */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-base font-extrabold text-foreground mb-5 flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Personal information
          </h2>

          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Full name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border-border bg-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Email address
              </label>
              <Input
                value={session?.user?.email || ""}
                disabled
                className="border-border bg-secondary text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
            <Button
              type="submit"
              disabled={nameLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-bold"
            >
              {nameLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {nameLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-extrabold text-foreground mb-5 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Change password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Current password
              </label>
              <Input
                type="password"
                placeholder="Your current password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="border-border bg-secondary"
              />
            </div>

            <Separator className="bg-border" />

            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                New password
              </label>
              <Input
                type="password"
                placeholder="Min. 6 characters"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                required
                className="border-border bg-secondary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">
                Confirm new password
              </label>
              <Input
                type="password"
                placeholder="Repeat new password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="border-border bg-secondary"
              />
            </div>

            <Button
              type="submit"
              disabled={passwordLoading}
              className="bg-foreground hover:bg-foreground/90 text-background rounded-xl px-6 font-bold"
            >
              {passwordLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              {passwordLoading ? "Changing..." : "Change password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
