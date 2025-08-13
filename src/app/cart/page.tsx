"use client";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AudioStatic from "@/components/audio-static/AudioStatic";
import { Minus, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

async function requestCheckoutUrl(items: any[]) {
  if (!items.length) return "#";
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: items.map((item) => ({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        })),
      }),
    });
    if (!res.ok) throw new Error("Failed to create checkout");
    const data = await res.json();
    return data.checkoutUrl as string;
  } catch (e) {
    console.error(e);
    return "#";
  }
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle hydration to prevent server/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [checkoutUrl, setCheckoutUrl] = useState<string>("#");

  useEffect(() => {
    let isCancelled = false;
    async function run() {
      const url = await requestCheckoutUrl(items);
      if (!isCancelled) setCheckoutUrl(url);
    }
    run();
    return () => {
      isCancelled = true;
    };
  }, [items]);

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

  const hasOutOfStock = items.some((item) => {
    if (!isHydrated) return false; // Don't check during SSR

    const totalInCart = items
      .filter((cartItem) => cartItem.variantId === item.variantId)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

    return false;
  });

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-svh pt-16 md:pt-0">
        <div className="mx-auto flex flex-col overflow-y-auto px-3 pb-20 pt-4 text-customNavy md:px-0 md:pb-10 md:pl-[258px] md:pr-6 md:pt-6">
          <h1 className="border-b-2 border-customGold pb-4 font-bigola text-3xl font-bold">
            Cart
          </h1>
          {hasOutOfStock && (
            <div className="mb-4 mt-3 rounded bg-red-100 text-center font-hypatia text-red-700">
              Some items in your cart are out of stock or have insufficient
              quantity. Please update your cart before checking out.
            </div>
          )}
          {!isHydrated ? (
            <div className="pt-10 text-center font-hypatia text-xl text-customNavy">
              Loading cart...
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-10 pt-10">
              <div className="text-center font-hypatia text-xl text-customNavy">
                Your cart is empty.
              </div>
              <Link
                href="/shop"
                className="font-bigola text-xl text-customNavy underline underline-offset-2 transition-all duration-300 ease-in-out md:hover:text-customGold"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-customNavy/50">
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
                        <div className="flex flex-col items-end gap-2">
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
                              className="border-r border-customGold p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Minus className="" />
                            </button>
                            <span className="h-6 min-w-[3rem] px-4 text-center font-bigola text-customNavy">
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
                              className="border-l border-customGold p-2 transition-colors hover:bg-customGold hover:text-customWhite disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="ml-4 font-hypatia text-sm text-red-500 transition-all hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mb-6 flex flex-col items-end gap-3 border-t-2 border-customGold pt-6">
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={clearCart}
                    className="font-hypatia text-sm text-red-600 transition-all hover:underline"
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
                <p className="font-bigola text-lg font-bold">
                  Subtotal: $
                  {items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
                <p className="font-hypatia text-sm text-customNavy">
                  Taxes and shipping calculated at checkout.
                </p>

                <a href={hasOutOfStock ? undefined : checkoutUrl}>
                  <Button
                    className="mx-auto w-fit rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
                    disabled={hasOutOfStock || checkoutUrl === "#"}
                  >
                    Checkout with Shopify
                  </Button>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
