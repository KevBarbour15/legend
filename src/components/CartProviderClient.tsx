"use client";
import { CartProvider } from "@/hooks/useCart";

export default function CartProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
