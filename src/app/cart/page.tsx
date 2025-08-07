"use client";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getVariantsInventory } from "@/app/actions/shopify";
import AudioStatic from "@/components/audio-static/AudioStatic";

function getShopifyCheckoutUrl(items: any) {
  if (!items.length) return "#";
  // Format: /cart/{variantId}:{quantity},{variantId}:{quantity}
  const cartString = items
    .map(
      (item) =>
        `${item.variantId.replace("gid://shopify/ProductVariant/", "")}:${item.quantity}`,
    )
    .join(",");
  return `https://legendhasithifi.myshopify.com/cart/${cartString}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [inventory, setInventory] = useState<{
    [id: string]: { availableForSale: boolean; quantityAvailable: number };
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      setError("");
      try {
        const variantIds = items.map((item) => item.variantId);
        if (variantIds.length === 0) return;
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantIds }),
        });
        const data = await res.json();
        const nodes = data.nodes;
        const inv = {};
        nodes.forEach((node) => {
          if (node) {
            inv[node.id] = {
              availableForSale: node.availableForSale,
              quantityAvailable: node.quantityAvailable,
            };
          }
        });
        setInventory(inv);
      } catch (e) {
        setError("Could not fetch inventory. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [items]);

  const checkoutUrl = getShopifyCheckoutUrl(items);

  const hasOutOfStock = items.some(
    (item) =>
      !inventory[item.variantId]?.availableForSale ||
      inventory[item.variantId]?.quantityAvailable < item.quantity,
  );

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-dvh w-screen pt-16 md:pt-0">
        <div className="mx-auto flex flex-col overflow-y-auto px-3 pb-20 md:px-0 md:pb-10 md:pl-[258px] md:pr-6 md:pt-6">
          <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
          {loading && (
            <div className="mb-4 text-blue-600">Checking inventory...</div>
          )}
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {hasOutOfStock && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
              Some items in your cart are out of stock or have insufficient
              quantity. Please update your cart before checking out.
            </div>
          )}
          {items.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <>
              <ul className="mb-6 divide-y">
                {items.map((item) => {
                  const inv = inventory[item.variantId];
                  const isOut =
                    inv &&
                    (!inv.availableForSale ||
                      inv.quantityAvailable < item.quantity);
                  return (
                    <li
                      key={item.variantId}
                      className="flex items-center gap-4 py-4"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="mt-1 text-xs">
                          {inv ? (
                            inv.availableForSale ? (
                              inv.quantityAvailable >= item.quantity ? (
                                <span className="text-green-600">
                                  In stock ({inv.quantityAvailable} left)
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  Only {inv.quantityAvailable} left
                                </span>
                              )
                            ) : (
                              <span className="text-red-600">Out of stock</span>
                            )
                          ) : (
                            <span className="text-gray-400">Checking...</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="rounded border px-2 py-1 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="rounded border px-2 py-1"
                          >
                            +
                          </button>
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
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear Cart
                </button>
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
