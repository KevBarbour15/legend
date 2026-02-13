"use client";

import Link from "next/link";
import { ShoppingCart } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

const DesktopCartIcon = () => {
  const pathname = usePathname();

  // Hide on home page, cart page, and dashboard
  if (pathname === "/cart" || pathname === "/dashboard") {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed right-6 top-6 z-50 hidden items-center justify-center rounded-sm border border-customNavy bg-customCream/75 p-2 text-customNavy backdrop-blur-[2px] transition-all duration-300 ease-in-out box-shadow-card md:flex lg:hover:bg-customNavy lg:hover:text-customWhite"
    >
      <ShoppingCart className="h-5 w-5 drop-shadow-text" />
    </Link>
  );
};

export default DesktopCartIcon;
