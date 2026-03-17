/** @format */

"use client";

import Image from "next/image";
import { Gift, Package2, Star, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessProfileProduct } from "@/redux/services/businessProfileAPI";
import { Badge } from "@/components/ui/badge";

interface BusinessProductCardProps {
  product: BusinessProfileProduct;
}

export default function BusinessProductCard({
  product,
}: BusinessProductCardProps) {
  const activePrice = product.discountedPrice ?? product.price;
  const hasDiscount =
    product.discountedPrice !== undefined &&
    product.discountedPrice < product.price;
  const savings = hasDiscount ? product.price - activePrice : 0;
  const isOutOfStock =
    product.stock <= 0 || product.stockStatus === "out_of_stock";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0px_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_22px_55px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {hasDiscount && (
            <Badge className="border-0 bg-rose-500 text-white hover:bg-rose-500">
              <Tag className="mr-1 h-3 w-3" />
              Save {product.currency}
              {savings.toFixed(2)}
            </Badge>
          )}
          {product.promoIsActive &&
            product.promoBuyQuantity &&
            product.promoFreeQuantity && (
              <Badge className="border-0 bg-emerald-500 text-white hover:bg-emerald-500">
                <Gift className="mr-1 h-3 w-3" />
                Buy {product.promoBuyQuantity} Get {product.promoFreeQuantity}
              </Badge>
            )}
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge
            variant="outline"
            className={cn(
              "border-white/70 bg-white/90 backdrop-blur-sm",
              isOutOfStock ? "text-red-600" : "text-emerald-700",
            )}
          >
            <Package2 className="mr-1 h-3 w-3" />
            {isOutOfStock ? "Out of stock" : `In stock (${product.stock})`}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-0 p-4 sm:p-5">
        <h3
          className="font-semibold text-foreground text-base sm:text-lg line-clamp-1"
          title={product.title}
        >
          {product.title}
        </h3>
        <p
          className=" text-xs font-normal text-slate-500 sm:text-sm line-clamp-2"
          title={product.description}
        >
          {product.description || "No description available"}
        </p>

        <div className="mt-auto flex flex-col gap-3 pt-2 ">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-primary sm:text-xl">
              {product.currency}
              {activePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm font-medium text-slate-400 line-through">
                {product.currency}
                {product.price.toFixed(2)}
              </span>
            )}
            <Badge
              variant="outline"
              className="border-slate-200 text-slate-600"
            >
              {product.vat > 0
                ? `VAT ${product.currency}${product.vat.toFixed(2)}`
                : "No VAT"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* {hasDiscount && (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                Discounted from {product.currency}
                {product.price.toFixed(2)}
              </div>
            )} */}
            {product.promoIsActive &&
              product.promoBuyQuantity &&
              product.promoFreeQuantity && (
                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Promo: buy {product.promoBuyQuantity}, get{" "}
                  {product.promoFreeQuantity}
                </div>
              )}
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4",
                      i < Math.round(product.rating)
                        ? "fill-current"
                        : "text-slate-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {product.rating.toFixed(1)}
              </span>
            </div>

            <span className="text-sm text-slate-500">
              {product.reviewsCount} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
