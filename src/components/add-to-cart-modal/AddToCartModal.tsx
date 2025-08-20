"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
}

const AddToCartModal = ({
  open,
  onOpenChange,
  productTitle,
}: AddToCartDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center bg-black/50 p-3 px-6 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close Modal"
        className="fixed right-3 top-3 z-[10000] rounded p-1 md:right-6 md:top-6"
        onClick={() => onOpenChange(false)}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-customWhite transition-all duration-300 md:hover:text-customGold"
        >
          <path
            d="M200 56L56 200M56 56L200 200"
            stroke="currentColor"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex h-fit flex-col overflow-hidden rounded-sm border border-customNavy/20 bg-customWhite p-3 drop-shadow-card sm:max-h-[90vh] sm:max-w-[450px]">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-bigola text-3xl font-bold text-customNavy md:text-4xl">
              Added to Cart!
            </h2>
            <p className="mt-3 text-pretty font-hypatia text-lg text-customNavy/80">
              <span className="font-semibold">{productTitle}</span> has been
              added to your cart.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/cart"
              className="rounded-sm border border-transparent bg-customGold px-4 py-2 text-center font-bigola text-customWhite transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
            >
              Go to Cart
            </a>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm border border-customNavy px-4 py-2 font-bigola text-customNavy transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-customNavy md:hover:text-customWhite md:active:bg-customNavy/80"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body level
  if (typeof window !== "undefined") {
    return createPortal(dialogContent, document.body);
  }

  return null;
};

export default AddToCartModal;
