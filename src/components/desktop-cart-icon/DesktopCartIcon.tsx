"use client";

import Link from "next/link";
import { ShoppingCart } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

const DesktopCartIcon = () => {
  const pathname = usePathname();

  if (pathname === "/cart" || pathname === "/dashboard") {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed right-6 top-6 z-50 hidden items-center justify-center rounded-full border border-neutral-400/20 p-1 text-customNavy mix-blend-difference backdrop-blur-sm transition-all duration-300 ease-in-out box-shadow-card md:flex lg:hover:bg-customNavy lg:hover:text-customWhite"
    >
      <ShoppingCart
        weight="fill"
        className="text-customGold drop-shadow-text invert"
        size={28}
      />
    </Link>
  );
};

export default DesktopCartIcon;
