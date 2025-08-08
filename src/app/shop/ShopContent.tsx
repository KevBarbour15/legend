"use client";

import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

export default function ShopContent({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="h-full pt-16 md:pt-0">
        <div className="mx-auto h-full overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div className="mb-6 flex items-center justify-between border-b-2 border-customGold pb-4 font-hypatia text-lg text-customNavy">
            <h2 className="font-bigola text-2xl text-shadow-custom">
              Legend Has It Shop
            </h2>
            <Link href="/cart" className="flex items-center gap-2">
              Cart <CaretRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
