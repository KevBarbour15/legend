"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ProductContentProps } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import AudioStatic from "@/components/audio-static/AudioStatic";
import AddToCartModal from "@/components/add-to-cart-modal/AddToCartModal";
import Link from "next/link";
import { CaretLeft, CaretRight, Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useGSAP, gsap } from "@/lib/gsap";

import ProductImageSwiper from "@/components/product-image-swiper";

const ProductContent = ({ product }: ProductContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const variantsRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const variants = product.variants.nodes;
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id || variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];
  const { addToCart, items } = useCart();
  const [open, setOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration to prevent server/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useGSAP(
    () => {
      gsap.set(
        [
          navigationRef.current,
          imageSectionRef.current,
          contentSectionRef.current,
          variantsRef.current,
          actionsRef.current,
        ],
        {
          opacity: 0,
          y: 30,
        },
      );

      gsap
        .timeline()
        .to(navigationRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        })
        .to(
          imageSectionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.25",
        )
        .to(
          contentSectionRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.25",
        )
        .to(
          variantsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.125",
        )
        .to(
          actionsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.125",
        );
    },
    { scope: containerRef },
  );

  const cartQuantity = isHydrated
    ? items.find((item) => item.variantId === selectedVariantId)?.quantity || 0
    : 0;
  const availableQuantity = Math.max(
    0,
    (selectedVariant?.quantityAvailable || 0) - cartQuantity,
  );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= availableQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    setQuantity(1);
  };

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-0">
        <div className="mx-auto h-full overflow-y-auto px-3 pb-12 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={navigationRef}
            className="hidden items-center justify-between border-b-2 border-customGold py-3 font-bigola text-lg text-customNavy opacity-0 text-shadow-custom md:mb-10 md:flex"
          >
            <Link
              href="/shop"
              className="flex items-center gap-2 transition-all duration-300 ease-in-out lg:hover:text-customGold"
            >
              <CaretLeft className="h-5 w-5 drop-shadow-text" />
              Shop
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 transition-all duration-300 ease-in-out lg:hover:text-customGold"
            >
              Cart <CaretRight className="h-5 w-5 drop-shadow-text" />
            </Link>
          </div>
          <div className="flex h-full flex-col gap-3 pt-3 md:flex-row md:gap-6 md:pt-0">
            <div ref={imageSectionRef} className="w-full opacity-0 md:w-1/2">
              <ProductImageSwiper
                images={product.images.nodes}
                productTitle={product.title}
              />
            </div>
            <div
              ref={contentSectionRef}
              className="flex flex-col gap-1 text-customNavy opacity-0 md:w-1/2"
            >
              <h1 className="font-bigola text-2xl text-shadow-custom">
                {product.title}
              </h1>
              <span className="font-hypatia text-lg text-shadow-custom">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </span>

              <div
                className="prose mt-3 max-w-none border-t-2 border-customGold pt-4 font-hypatia text-base text-shadow-custom lg:mt-6 lg:pt-6"
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml,
                }}
              />

              <div
                ref={variantsRef}
                className="mt-3 flex items-center gap-4 opacity-0 md:mt-20"
              >
                {variants.length > 1 && (
                  <div className="flex gap-2">
                    {variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      const isSoldOut = !variant.availableForSale;
                      const sizeLabel =
                        variant.selectedOptions.find(
                          (opt) => opt.name === "Size",
                        )?.value || variant.title;
                      return (
                        <Button
                          key={variant.id}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => handleVariantChange(variant.id)}
                          className={`relative min-w-10 rounded-sm border border-customNavy px-3 py-1 font-bigola text-xs transition-all duration-300 ease-in-out box-shadow-card ${isSelected ? "bg-customGold text-customWhite" : "text-customNavy backdrop-blur-[1px]"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"}`}
                        >
                          {sizeLabel}
                          {isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-3xl text-red-500">X</div>
                            </div>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
              {selectedVariant && !selectedVariant.availableForSale && (
                <span className="font-hypatia text-sm text-red-500">
                  Selected variant is sold out
                </span>
              )}
              {selectedVariant && selectedVariant.availableForSale && (
                <div ref={actionsRef} className="opacity-0">
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center rounded-sm border border-customGold backdrop-blur-[1px] box-shadow-card">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="border-r border-customGold p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Minus />
                      </button>
                      <span className="h-6 min-w-[3rem] px-4 text-center font-bigola text-customNavy">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= availableQuantity}
                        className="border-l border-customGold p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="" />
                      </button>
                    </div>
                  </div>
                  <Button
                    className="mb-6 mt-4 w-full rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-card sm:w-fit md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
                    onClick={() => {
                      addToCart(
                        {
                          variantId: selectedVariant.id,
                          title: product.title,
                          price: parseFloat(selectedVariant.price.amount),
                          image: product.images.nodes[0]?.url,
                          quantityAvailable: selectedVariant.quantityAvailable,
                          variantTitle: selectedVariant.title,
                          selectedOptions: selectedVariant.selectedOptions,
                        },
                        quantity,
                      );
                      setOpen(true);
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddToCartModal
        open={open}
        onOpenChange={setOpen}
        productTitle={product.title}
      />
    </>
  );
};

export default ProductContent;
