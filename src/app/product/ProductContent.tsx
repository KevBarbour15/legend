"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ProductContentProps } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import AudioStatic from "@/components/audio-static/AudioStatic";
import AddToCartDialog from "@/components/add-to-cart-dialog/AddToCartDialog";
import Link from "next/link";
import { CaretLeft, CaretRight, Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const ProductContent = ({ product }: ProductContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mainImage = product.images.nodes[0]?.url;
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

  // Get the actual available quantity for the selected variant, accounting for cart
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
    setQuantity(1); // Reset quantity when variant changes
  };

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="h-full pt-16 md:pt-0">
        <div className="mx-auto h-full overflow-y-auto px-3 pb-20 md:pb-10 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div className="hidden items-center justify-between border-b-2 border-customGold py-3 font-bigola text-lg text-customNavy text-shadow-custom md:mb-10 md:flex">
            <Link href="/shop" className="flex items-center gap-2">
              <CaretLeft className="h-5 w-5 drop-shadow-text" />
              Shop
            </Link>

            <Link href="/cart" className="flex items-center gap-2">
              Cart <CaretRight className="h-5 w-5 drop-shadow-text" />
            </Link>
          </div>
          <div className="flex h-full flex-col gap-3 pt-3 md:flex-row md:gap-6 md:pt-0">
            {mainImage && (
              <div className="box-shadow-card relative aspect-square w-full md:w-1/2">
                <Image
                  src={mainImage}
                  alt={product.images.nodes[0]?.altText || product.title}
                  className="h-full w-full border border-customNavy/20 object-cover"
                  width={600}
                  height={600}
                  priority
                  loading="eager"
                />
              </div>
            )}
            <div className="flex flex-col gap-1 text-customNavy md:w-1/2">
              <h1 className="font-bigola text-2xl text-shadow-custom">
                {product.title}
              </h1>
              <span className="font-hypatia text-lg text-shadow-custom">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </span>

              <Accordion
                type="single"
                collapsible
                className="border-b-2 border-customGold"
              >
                <AccordionItem value="description">
                  <AccordionTrigger className="font-bigola text-lg text-shadow-custom">
                    Details
                  </AccordionTrigger>
                  <AccordionContent className="prose max-w-none border-customGold font-hypatia text-base text-shadow-custom">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.descriptionHtml,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-3 flex items-center gap-4 md:mt-20">
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
                          className={`box-shadow-card relative min-w-10 rounded-sm border border-customGold px-3 py-1 font-bigola text-xs transition-all duration-300 ease-in-out ${isSelected ? "bg-customGold text-customWhite" : "text-customNavy backdrop-blur-[1px]"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"}`}
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
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="box-shadow-card flex items-center rounded-sm border border-customGold backdrop-blur-[1px]">
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
                    <span className="text-xs text-customNavy/70">
                      {availableQuantity} available
                      {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
                    </span>
                  </div>
                  <Button
                    className="box-shadow-card mb-6 mt-4 w-fit rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
                    onClick={() => {
                      addToCart(
                        {
                          variantId: selectedVariant.id,
                          title: product.title,
                          price: parseFloat(selectedVariant.price.amount),
                          image: mainImage,
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddToCartDialog
        open={open}
        onOpenChange={setOpen}
        productTitle={product.title}
      />
    </>
  );
};

export default ProductContent;
