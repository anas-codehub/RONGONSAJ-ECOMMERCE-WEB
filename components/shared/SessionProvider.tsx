"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useSession } from "next-auth/react";

function CartCleaner() {
  const { data: session, status } = useSession();
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (status === "loading") return;

    const storedUserId = localStorage.getItem("cart-user-id");
    const currentUserId = session?.user?.id || null;

    if (!currentUserId) {
      // Signed out — clear everything
      clearCart();
      localStorage.removeItem("cart-user-id");
      localStorage.removeItem("cart-storage");
      return;
    }

    if (storedUserId && storedUserId !== currentUserId) {
      // Different user — clear cart
      clearCart();
      localStorage.removeItem("cart-storage");
    }

    localStorage.setItem("cart-user-id", currentUserId);
  }, [session?.user?.id, status]);

  return null;
}

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextSessionProvider session={session}>
      <CartCleaner />
      {children}
    </NextSessionProvider>
  );
}
