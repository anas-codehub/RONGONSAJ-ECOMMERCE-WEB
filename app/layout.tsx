import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/shared/SessionProvider";
import { auth } from "@/lib/auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "RONGONSAAJ — Dress for the life you love",
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
    title: "RONGONSAAJ",
    description: "Dress for the life you love",
    url: process.env.NEXTAUTH_URL,
    siteName: "RONGONSAAJ",
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RONGONSAAJ",
    description: "Dress for the life you love",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning style={{ overflowY: "scroll" }}>
      <body className={`${geist.variable} antialiased min-h-screen`}>
        <SessionProvider session={session}>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
