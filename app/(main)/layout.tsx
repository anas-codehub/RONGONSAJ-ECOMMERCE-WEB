import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import MobileNav from "@/components/shared/MobileNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="light"
      data-theme="light"
      style={{
        colorScheme: "light",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
