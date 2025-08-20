"use client";

import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function ShopContent({ products }: { products: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    tl.set(headerRef.current, {
      opacity: 0,
      y: 25,
      duration: 0.25,
    })
      .set(gridRef.current, { opacity: 0, y: 25, duration: 0.25 })
      .to(headerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
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
        <div className="mx-auto h-full pb-20 md:pb-6 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={headerRef}
            className="mb-3 flex items-center justify-between border-b-2 border-customGold pb-4 pt-4 font-hypatia text-lg text-customNavy opacity-0 md:mb-6 md:pt-0"
          >
            <h2 className="font-bigola text-3xl italic text-customGold text-shadow-custom">
              Shop
            </h2>
            <Link
              href="/cart"
              className="hidden items-center justify-center gap-2 transition-all duration-300 ease-in-out md:flex lg:hover:text-customGold"
            >
              <p className="text-shadow-custom">Cart</p>
              <CaretRight className="h-4 w-4 drop-shadow-text" />
            </Link>
          </div>
          <div
            ref={gridRef}
            className="grid w-full grid-cols-1 gap-4 opacity-0 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3"
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
