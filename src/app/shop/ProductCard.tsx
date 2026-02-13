"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ProductContentProps } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import AddToCartModal from "@/components/add-to-cart-modal/AddToCartModal";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: ProductContentProps) {
  const mainImage = product.images.nodes[0]?.url;
  const variants = product.variants.nodes;
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id || variants[0]?.id,
  );
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-sm border border-neutral-400/20 bg-customWhite/25 text-customNavy backdrop-blur-[2px] box-shadow-card">
        {mainImage && (
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={mainImage}
              alt={product.images.nodes[0]?.altText || product.title}
              className="h-full w-full object-cover"
              width={700}
              height={700}
              priority
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between p-3 font-bigola text-customNavy">
          <div className="mb-3 flex h-fit justify-between gap-3 lg:mb-6">
            <h3 className="mb-3 font-bigola text-2xl text-customNavy text-shadow-custom">
              {product.title}
            </h3>
            <p className="mb-3 font-hypatia text-lg text-customNavy text-shadow-custom">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)}
            </p>
          </div>
          <div className="h-fit">
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const isSoldOut = !variant.availableForSale;
                  const sizeLabel =
                    variant.selectedOptions.find((opt) => opt.name === "Size")
                      ?.value || variant.title;
                  return (
                    <Button
                      key={variant.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                      }}
                      className={`relative min-w-10 rounded-sm border border-customNavy px-3 py-1 font-bigola text-xs transition-all duration-300 ease-in-out box-shadow-text ${isSelected ? "bg-customGold text-customWhite" : "bg-customWhite text-customNavy"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"} `}
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
            </div>
            {selectedVariant && !selectedVariant.availableForSale && (
              <span className="text-xs text-red-500">
                Selected size is sold out
              </span>
            )}
            {selectedVariant && selectedVariant.availableForSale && (
              <Button
                className="mx-auto mt-4 w-full rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
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
                    1,
                  );
                  setOpen(true);
                }}
              >
                Add to Cart
              </Button>
            )}
            <Link href={`/product/${product?.handle}`}>
              <Button className="mx-auto mt-4 w-full rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold">
                View Product
              </Button>
            </Link>
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
}
