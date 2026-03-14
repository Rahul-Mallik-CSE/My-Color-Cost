/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Trash2, Tag, Gift } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useApplyProductDiscountMutation } from "@/redux/services/productsAPI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductPromoModal from "./ProductPromoModal";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"amount" | "percentage">(
    "amount",
  );
  const [discountValue, setDiscountValue] = useState("");
  const [applyProductDiscount, { isLoading: isApplying }] =
    useApplyProductDiscountMutation();

  const handleApplyDiscount = async () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (discountType === "percentage" && parseFloat(discountValue) > 99) {
      toast.error("Percentage discount must be less than 100%");
      return;
    }
    try {
      await applyProductDiscount({
        id: product.id,
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
      }).unwrap();
      toast.success("Discount applied successfully");
      setIsDiscountOpen(false);
      setDiscountValue("");
    } catch {
      toast.error("Failed to apply discount. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-[6px_6px_54px_0px_#0000000D] hover:shadow-sm transition-all duration-200 border-none flex flex-col h-full group">
      {/* Product Image */}
      <div className="relative aspect-square w-full mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gray-50">
        {/* Placeholder logic if image is missing could go here, but next/image handles src */}
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Delete Button - Absolute positioned */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}

      <div className="flex flex-col flex-1 gap-2">
        <h3
          className="font-semibold text-foreground text-base sm:text-lg line-clamp-1"
          title={product.title}
        >
          {product.title}
        </h3>
        <h6
          className="font-normal text-foreground text-xs sm:text-sm line-clamp-1"
          title={product.title}
        >
          {product.description}
        </h6>

        {/* Price and Rating Row */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-primary font-bold text-base sm:text-lg">
              {product.currency}
              {(product.discountedPrice ?? product.price).toFixed(2)}
            </span>
            {product.discountedPrice !== undefined &&
              product.discountedPrice !== product.price && (
                <span className="text-gray-400 font-medium text-sm line-through">
                  {product.currency}
                  {product.price.toFixed(2)}
                </span>
              )}
            {product.vat !== undefined && product.vat > 0 && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                +{product.currency}
                {product.vat.toFixed(2)} VAT
              </span>
            )}
            {product.vat === 0 && (
              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                No VAT
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4",
                    i < Math.round(product.rating)
                      ? "fill-current"
                      : "text-gray-200",
                  )}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Stock Status */}
          {product.stockStatus === "in_stock" && (
            <p className="text-green-600 font-semibold text-sm mt-1">
              ✓ In Stock
            </p>
          )}

          {/* Promo Display */}
          {product.promoIsActive &&
            product.promoBuyQuantity &&
            product.promoFreeQuantity && (
              <p className="text-green-600 font-semibold text-sm mt-1">
                Buy {product.promoBuyQuantity} get {product.promoFreeQuantity}
              </p>
            )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 bg-[#E2EAF8] text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Edit Product
          </button>
          <button
            onClick={() => setIsPromoOpen(true)}
            className="py-2 px-3 sm:py-2.5 sm:px-3 bg-green-100 text-green-600 font-semibold rounded-xl hover:bg-green-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Apply Promo"
          >
            <Gift className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDiscountType("amount");
              setDiscountValue("");
              setIsDiscountOpen(true);
            }}
            className="py-2 px-3 sm:py-2.5 sm:px-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer"
            title="Apply Discount"
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Individual Discount Modal */}
      <Dialog open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount — {product.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Type</label>
              <Select
                value={discountType}
                onValueChange={(value: "amount" | "percentage") =>
                  setDiscountType(value)
                }
              >
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount (£)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Value</label>
              <Input
                type="number"
                placeholder={
                  discountType === "percentage"
                    ? "Enter percentage value (max 99)"
                    : "Enter amount value"
                }
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="h-11 rounded-lg"
                min="0"
                max={discountType === "percentage" ? "99" : undefined}
              />
            </div>
            <Button
              onClick={handleApplyDiscount}
              disabled={isApplying}
              className="h-11 rounded-lg mt-2"
            >
              {isApplying ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Promo Modal */}
      <ProductPromoModal
        isOpen={isPromoOpen}
        onOpenChange={setIsPromoOpen}
        productId={product.id}
        productName={product.title}
        currentPromoBuyQuantity={product.promoBuyQuantity}
        currentPromoFreeQuantity={product.promoFreeQuantity}
      />
    </div>
  );
}
