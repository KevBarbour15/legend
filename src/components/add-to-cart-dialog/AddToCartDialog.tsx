"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <DialogContent className="rounded-sm border-customNavy/20 bg-customWhite">
        <DialogHeader>
          <DialogTitle className="font-bigola text-customNavy">
            Added to Cart!
          </DialogTitle>
          <DialogDescription className="text-pretty font-hypatia">
            <span>{productTitle}</span> has been added to your cart.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <a
            href="/cart"
            className="rounded-sm border border-transparent bg-customGold px-4 py-2 font-bigola text-customWhite transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold"
          >
            Go to Cart
          </a>
          <DialogClose asChild>
            <button className="rounded-sm border border-transparent bg-customNavy px-4 py-2 font-bigola text-customWhite transition-all duration-300 ease-in-out md:hover:border-customNavy/20 md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold">
              Continue Shopping
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog;
