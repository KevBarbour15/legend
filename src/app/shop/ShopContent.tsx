"use client";

import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function ShopContent({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.set(gridRef.current, { opacity: 0, y: 25 })
      .to(gridRef.current, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
  }, []);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-0">
        <div className="mx-auto h-full px-3 pb-12 pt-6 md:pb-6 md:pl-[240px] md:pr-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={gridRef}
            className="grid w-full grid-cols-2 gap-4 opacity-0 sm:grid-cols-2 md:px-0 lg:gap-8 2xl:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
