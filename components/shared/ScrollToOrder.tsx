"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

export default function ScrollToOrder() {
  const [show, setShow] = useState(true); // Changed to true (show at top)

  useEffect(() => {
    const handleScroll = () => {
      // Hide button when user scrolls down 200px
      // Show button when at top (scrollY <= 200)
      setShow(window.scrollY <= 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToOrder = () => {
    // Find the add to cart section
    const target = document.getElementById("add-to-cart-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToOrder}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-extrabold text-sm shadow-lg"
      style={{
        boxShadow: "0 8px 30px rgba(107,26,40,0.5)",
        animation: "bounceIn 0.3s ease",
      }}
    >
      <ShoppingCart className="h-4 w-4" />
      Order now
    </button>
  );
}
