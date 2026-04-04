import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/shared/SessionProvider";
import { auth } from "@/lib/auth";
import Footer from "@/components/shared/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "RONGONSAAJ - Dress for the fashion you love",
    template: "%s | RONGONSAAJ",
  },
  description:
    "Handpicked fashion pieces that celebrate your unique style. Shop dresses, tops, bottoms and accessories in Dhaka, Bangladesh.",
  keywords: [
    "fashion",
    "clothing",
    "Bangladesh",
    "Dhaka",
    "dresses",
    "tops",
    "online shopping",
  ],
  openGraph: {
    title: "RÊVE Fashion",
    description: "Dress for the life you love",
    url: process.env.NEXTAUTH_URL,
    siteName: "RÊVE Fashion",
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RÊVE Fashion",
    description: "Dress for the life you love",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <SessionProvider session={session}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
