"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
}

const AddToCartDialog = ({
  open,
  onOpenChange,
  productTitle,
}: AddToCartDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none border-customNavy/20 bg-[#f5f5f5]">
        <DialogTitle className="font-bigola text-customNavy">
          Added to Cart!
        </DialogTitle>
        <DialogDescription className="text-pretty font-hypatia">
          <span>{productTitle}</span> has been added to your cart.
        </DialogDescription>
        <div className="mt-4 flex justify-center gap-4">
          <DialogClose asChild>
            <button
              className="border border-transparent bg-customNavy px-4 py-2 font-bigola text-[#f5f5f5] transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-[#f5f5f5] md:hover:text-customNavy md:active:bg-customGold"
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </button>
          </DialogClose>
          <DialogClose asChild>
            <a
              href="/cart"
              className="border border-transparent bg-customGold px-4 py-2 font-bigola text-[#f5f5f5] transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-[#f5f5f5] md:hover:text-customNavy md:active:bg-customGold"
            >
              Go to Cart
            </a>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
