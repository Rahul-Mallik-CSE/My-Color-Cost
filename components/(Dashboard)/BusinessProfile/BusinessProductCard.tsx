/** @format */

"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessProfileProduct } from "@/redux/services/businessProfileAPI";

interface BusinessProductCardProps {
  product: BusinessProfileProduct;
}

export default function BusinessProductCard({
  product,
}: BusinessProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-[6px_6px_54px_0px_#0000000D] hover:shadow-sm transition-all duration-200 border-none flex flex-col h-full group">
      {/* Product Image */}
      <div className="relative aspect-square w-full mb-3 sm:mb-4 rounded-xl overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-2">
        <h3
          className="font-semibold text-foreground text-base sm:text-lg line-clamp-1"
          title={product.title}
        >
          {product.title}
        </h3>
        <p
          className="font-normal text-gray-500 text-xs sm:text-sm line-clamp-2"
          title={product.description}
        >
          {product.description}
        </p>

        {/* Price & VAT */}
        <div className="flex items-baseline gap-2 flex-wrap mt-auto pt-2">
          <span className="text-primary font-bold text-base sm:text-lg">
            {product.currency}
            {product.price.toFixed(2)}
          </span>
          {product.vat > 0 ? (
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              +{product.vat.toFixed(2)}% VAT
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              No VAT
            </span>
          )}
        </div>

        {/* Rating */}
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
      </div>
    </div>
  );
}
