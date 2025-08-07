"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ProductContentProps } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import AddToCartDialog from "@/components/add-to-cart-dialog/AddToCartDialog";

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
      <Link href={`/product/${product?.handle}`} className="block h-full">
        <div className="h-ful l flex w-full flex-col overflow-hidden rounded-sm border border-customNavy/20 bg-neutral-300/15 text-customNavy shadow-sm backdrop-blur-[1px] md:shadow-md">
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
          <div className="p-3 font-bigola text-customNavy">
            <h2 className="mb-3 capitalize text-customNavy">{product.title}</h2>
            <p className="mb-3">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex gap-3">
                {variants.map((variant) => {
                  const isSelected = selectedVariantId === variant.id;
                  const isSoldOut = !variant.availableForSale;
                  const sizeLabel =
                    variant.selectedOptions.find((opt) => opt.name === "Size")
                      ?.value || variant.title;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVariantId(variant.id);
                      }}
                      className={`relative aspect-square h-10 rounded-sm border border-customGold font-bigola text-xs transition-colors ${isSelected ? "bg-customGold text-customWhite" : "bg-customWhite/50 text-customNavy"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"} `}
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
            </div>
            {selectedVariant && !selectedVariant.availableForSale && (
              <span className="text-xs text-red-500">
                Selected size is sold out
              </span>
            )}
            {selectedVariant && selectedVariant.availableForSale && (
              <button
                className="mt-4 w-full rounded-sm bg-customNavy px-4 py-2 font-bigola text-white transition-colors hover:bg-customGold hover:text-customNavy"
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(
                    {
                      variantId: selectedVariant.id,
                      title: product.title,
                      price: parseFloat(selectedVariant.price.amount),
                      image: mainImage,
                    },
                    1,
                  );
                  setOpen(true);
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>

      <AddToCartDialog
        open={open}
        onOpenChange={setOpen}
        productTitle={product.title}
      />
    </>
  );
}
