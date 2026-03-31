import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/shared/SessionProvider";
import { auth } from "@/lib/auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RÊVE Fashion",
  description: "Dress for the life you love",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <SessionProvider session={session}>
          <Navbar />
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
