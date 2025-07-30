"use client";

import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    images: { nodes: { url: string; altText: string | null }[] };
    variants: {
      nodes: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        selectedOptions: { name: string; value: string }[];
      }[];
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.nodes[2]?.url;
  const variants = product.variants.nodes;
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.find((v) => v.availableForSale)?.id || variants[0]?.id,
  );
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border border-neutral-400/20 bg-neutral-300/15 text-customNavy shadow-sm backdrop-blur-[1px] md:shadow-md">
      {mainImage && (
        <div className="relative aspect-square w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.images.nodes[0]?.altText || product.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-3 font-hypatia text-customNavy">
        <div className="flex justify-between">
          <h2 className="mb-3 font-bigola text-3xl capitalize text-customNavy">
            {product.title}
          </h2>
          <span className="text-lg font-semibold">
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}{" "}
            {selectedVariant.price.currencyCode}
          </span>
        </div>
        <div className="mb-3 flex items-center gap-4">
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
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`rounded-sm border border-customGold/50 px-3 py-1 font-bigola text-sm transition-colors ${isSelected ? "bg-customNavy/75 text-customWhite" : "bg-customWhite/50 text-customNavy"} ${isSoldOut ? "cursor-not-allowed opacity-50" : "hover:bg-customNavy hover:text-white"} `}
                >
                  {sizeLabel}
                  {isSoldOut ? " (Sold Out)" : ""}
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
        {product.images.nodes.length > 1 && (
          <div className="mt-2 flex gap-2">
            {product.images.nodes.slice(1).map((img, idx) => (
              <img
                key={img.url}
                src={img.url}
                alt={img.altText || `${product.title} image ${idx + 2}`}
                className="h-12 w-12 rounded border object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
