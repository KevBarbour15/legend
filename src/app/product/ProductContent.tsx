"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ProductContentProps } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import AudioStatic from "@/components/audio-static/AudioStatic";
import AddToCartDialog from "@/components/add-to-cart-dialog/AddToCartDialog";
import Link from "next/link";
import { CaretLeft, CaretRight, Minus, Plus } from "@phosphor-icons/react";

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
        <div className="mx-auto h-full overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div className="mb-6 flex items-center justify-between border-b-2 border-customGold pb-4 font-hypatia text-lg text-customNavy">
            <Link href="/shop" className="flex items-center gap-2">
              <CaretLeft className="h-4 w-4" />
              Shop
            </Link>

            <Link href="/cart" className="flex items-center gap-2">
              Cart <CaretRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex h-full flex-col gap-6 pt-3 md:flex-row md:pt-0">
            {mainImage && (
              <div className="relative aspect-square w-full drop-shadow-card md:w-1/2">
                <Image
                  src={mainImage}
                  alt={product.images.nodes[0]?.altText || product.title}
                  className="h-full w-full border border-customNavy/20 object-cover"
                  width={600}
                  height={600}
                  priority
                />
              </div>
            )}
            <div className="flex flex-col gap-3 text-customNavy md:w-1/2">
              <h1 className="font-bigola text-2xl text-shadow-custom">
                {product.title}
              </h1>
              <span className="font-bigola text-lg text-shadow-custom">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </span>

              <div
                dangerouslySetInnerHTML={{
                  __html: product.descriptionHtml,
                }}
                className="prose max-w-none font-hypatia text-base text-shadow-custom"
              />

              <div className="mt-3 flex items-center gap-4">
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
                        <button
                          key={variant.id}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => handleVariantChange(variant.id)}
                          className={`relative aspect-square h-10 rounded-sm border border-customGold font-bigola text-xs transition-colors ${isSelected ? "bg-customGold text-customWhite" : "bg-customWhite/50 text-customNavy"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"}`}
                        >
                          {sizeLabel}
                          {isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-3xl text-red-500">X</div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {selectedVariant && !selectedVariant.availableForSale && (
                <span className="text-sm text-red-500">
                  Selected variant is sold out
                </span>
              )}
              {selectedVariant && selectedVariant.availableForSale && (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="font-hypatia text-sm text-customNavy">
                      Quantity:
                    </span>
                    <div className="flex items-center rounded-sm border border-customGold">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[3rem] px-4 py-2 text-center font-bigola text-customNavy">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= availableQuantity}
                        className="p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-customNavy/70">
                      {availableQuantity} available
                      {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
                    </span>
                  </div>
                  <button
                    className="mt-4 w-full rounded-sm bg-customNavy px-4 py-2 font-bigola text-white drop-shadow-card transition-colors hover:bg-customGold hover:text-customNavy md:w-fit"
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
                  </button>
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
