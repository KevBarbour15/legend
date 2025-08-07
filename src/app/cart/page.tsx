"use client";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AudioStatic from "@/components/audio-static/AudioStatic";
import { Minus, Plus } from "@phosphor-icons/react";

function getShopifyCheckoutUrl(items: any) {
  if (!items.length) return "#";
  // Format: /cart/{variantId}:{quantity},{variantId}:{quantity}
  const cartString = items
    .map(
      (item: any) =>
        `${item.variantId.replace("gid://shopify/ProductVariant/", "")}:${item.quantity}`,
    )
    .join(",");
  return `https://legendhasithifi.myshopify.com/cart/${cartString}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle hydration to prevent server/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const checkoutUrl = getShopifyCheckoutUrl(items);

  // Handle quantity changes with validation
  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      const item = items.find((item) => item.variantId === variantId);
      if (item && item.quantityAvailable) {
        // Calculate total quantity of this variant already in cart (excluding current item)
        const otherItemsOfSameVariant = items.filter(
          (cartItem) => cartItem.variantId === variantId && cartItem !== item,
        );
        const totalOtherQuantity = otherItemsOfSameVariant.reduce(
          (sum, cartItem) => sum + cartItem.quantity,
          0,
        );

        // Check if new quantity + other items would exceed available inventory
        if (newQuantity + totalOtherQuantity <= item.quantityAvailable) {
          updateQuantity(variantId, newQuantity);
        }
      } else {
        // Fallback: allow the change if we don't have inventory data
        updateQuantity(variantId, newQuantity);
      }
    }
  };

  // Calculate if any items exceed their cart-adjusted limits
  const hasOutOfStock = items.some((item) => {
    if (!isHydrated) return false; // Don't check during SSR

    // Find other items with the same variantId to calculate total in cart
    const totalInCart = items
      .filter((cartItem) => cartItem.variantId === item.variantId)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

    // For now, we'll assume items are available if they're in the cart
    // In a real implementation, you'd want to store the original available quantity
    // when items are added to cart, or fetch it once per session
    return false; // Simplified for now - items in cart are assumed available
  });

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-svh pt-16 md:pt-0">
        <div className="mx-auto flex flex-col overflow-y-auto px-3 pb-20 text-customNavy md:px-0 md:pb-10 md:pl-[258px] md:pr-6 md:pt-6">
          <h1 className="border-b-2 border-customGold pb-4 font-bigola text-3xl font-bold">
            Your Cart
          </h1>
          {hasOutOfStock && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
              Some items in your cart are out of stock or have insufficient
              quantity. Please update your cart before checking out.
            </div>
          )}
          {!isHydrated ? (
            <div className="text-center text-gray-500">Loading cart...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <ul className="mb-6 divide-y divide-customNavy/50">
                {items.map((item) => {
                  return (
                    <li
                      key={item.variantId}
                      className="flex w-full items-center gap-4 py-4"
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex gap-4 font-bigola">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={72}
                              height={72}
                              className="h-20 w-20 rounded-sm object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold">{item.title}</div>
                            {(item.variantTitle &&
                              item.variantTitle !== item.title) ||
                            (item.selectedOptions &&
                              item.selectedOptions.length > 0) ? (
                              <div className="text-sm text-gray-500">
                                {item.selectedOptions?.find(
                                  (opt) => opt.name === "Size",
                                )?.value ||
                                  item.selectedOptions?.find(
                                    (opt) => opt.name === "Title",
                                  )?.value ||
                                  item.variantTitle ||
                                  "Variant"}
                              </div>
                            ) : null}
                            <div className="text-sm text-gray-600">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-sm border border-customGold">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.variantId,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[3rem] px-4 py-2 text-center font-bigola text-customNavy">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.variantId,
                                  item.quantity + 1,
                                )
                              }
                              disabled={
                                item.quantityAvailable
                                  ? (() => {
                                      const totalInCart = items
                                        .filter(
                                          (cartItem) =>
                                            cartItem.variantId ===
                                            item.variantId,
                                        )
                                        .reduce(
                                          (sum, cartItem) =>
                                            sum + cartItem.quantity,
                                          0,
                                        );
                                      return (
                                        totalInCart >= item.quantityAvailable
                                      );
                                    })()
                                  : false
                              }
                              className="p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="ml-4 text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Clear Cart
                  </button>
                  {/* Temporary debug info */}
                  {process.env.NODE_ENV === "development" && (
                    <div className="text-xs text-gray-400">
                      {items.length} items
                    </div>
                  )}
                </div>
                <span className="text-lg font-bold">
                  Total: $
                  {items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>
              <a
                href={hasOutOfStock ? undefined : checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="w-full rounded bg-customNavy px-4 py-3 text-xl font-bold text-white transition-colors hover:bg-customGold hover:text-customNavy"
                  disabled={hasOutOfStock}
                >
                  Checkout
                </button>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
