/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useApplyProductPromoMutation,
  useRemoveProductPromoMutation,
} from "@/redux/services/productsAPI";

interface ProductPromoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentPromoBuyQuantity?: number | null;
  currentPromoFreeQuantity?: number | null;
}

export default function ProductPromoModal({
  isOpen,
  onOpenChange,
  productId,
  productName,
  currentPromoBuyQuantity,
  currentPromoFreeQuantity,
}: ProductPromoModalProps) {
  const [promoBuyQuantity, setPromoBuyQuantity] = useState("");
  const [promoFreeQuantity, setPromoFreeQuantity] = useState("");

  const [applyProductPromo, { isLoading: isApplying }] =
    useApplyProductPromoMutation();
  const [removeProductPromo, { isLoading: isRemoving }] =
    useRemoveProductPromoMutation();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Initialize form with current promo values when opening
      if (currentPromoBuyQuantity && currentPromoFreeQuantity) {
        setPromoBuyQuantity(currentPromoBuyQuantity.toString());
        setPromoFreeQuantity(currentPromoFreeQuantity.toString());
      } else {
        setPromoBuyQuantity("");
        setPromoFreeQuantity("");
      }
    }
    onOpenChange(open);
  };

  const handleApplyPromo = async () => {
    if (!promoBuyQuantity || !promoFreeQuantity) {
      toast.error("Please enter both buy and free quantities");
      return;
    }

    const buyQty = parseInt(promoBuyQuantity);
    const freeQty = parseInt(promoFreeQuantity);

    if (buyQty <= 0 || freeQty <= 0) {
      toast.error("Quantities must be greater than 0");
      return;
    }

    if (freeQty >= buyQty) {
      toast.error(
        "Free quantity must be less than buy quantity. Example: buy 5 get 1 free — not buy 1 get 5 free.",
      );
      return;
    }

    try {
      await applyProductPromo({
        productId,
        promo_buy_quantity: buyQty,
        promo_free_quantity: freeQty,
      }).unwrap();
      toast.success("Promo applied successfully");
      handleOpenChange(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to apply promo. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleRemovePromo = async () => {
    try {
      await removeProductPromo(productId).unwrap();
      toast.success("Promo removed successfully");
      handleOpenChange(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to remove promo. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Promo Setup — {productName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Buy Quantity</label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={promoBuyQuantity}
              onChange={(e) => setPromoBuyQuantity(e.target.value)}
              className="h-11 rounded-lg"
              min="1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Free Quantity</label>
            <Input
              type="number"
              placeholder="e.g., 1"
              value={promoFreeQuantity}
              onChange={(e) => setPromoFreeQuantity(e.target.value)}
              className="h-11 rounded-lg"
              min="1"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleApplyPromo}
              disabled={isApplying || isRemoving}
              className="flex-1 h-11 rounded-lg"
            >
              {isApplying ? "Applying..." : "Apply Promo"}
            </Button>
            <Button
              onClick={handleRemovePromo}
              disabled={isApplying || isRemoving}
              variant="outline"
              className="flex-1 h-11 rounded-lg"
            >
              {isRemoving ? "Removing..." : "Remove Promo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
