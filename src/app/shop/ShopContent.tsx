"use client";

import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ShopContent({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="pt-16 md:pt-0">
        <div className="mx-auto flex flex-col items-center justify-center overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
