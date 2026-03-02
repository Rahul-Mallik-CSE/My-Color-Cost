/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Truck,
  ShoppingBag,
  PackageOpen,
  Pencil,
} from "lucide-react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { ProductGridSkeleton } from "@/components/Skeleton/ProductGridSkeleton";
import BusinessProductCard from "./BusinessProductCard";
import EditBusinessProfileModal from "./EditBusinessProfileModal";
import { useGetBusinessProfileQuery } from "@/redux/services/businessProfileAPI";

export default function BusinessProfileClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const { data, isLoading, isError } = useGetBusinessProfileQuery();

  const filteredProducts =
    data?.products.filter(
      (p) =>
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  return (
    <>
      <DashboardHeader title="Retailer Dashboard" onSearch={setSearchQuery} />

      <div className="p-4 md:p-8 flex flex-col gap-6 sm:gap-8">
        {/* ── Business Profile Header Card ── */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-36 bg-gray-200 rounded" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-500 text-sm font-medium">
            Failed to load business profile. Please try again.
          </div>
        ) : data ? (
          <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-gray-100/60">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Logo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm">
                {data.retailer.business_logo_url ? (
                  <Image
                    src={data.retailer.business_logo_url}
                    alt={data.retailer.business_name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">
                  {data.retailer.business_name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-4">
                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>{data.retailer.retailer_email}</span>
                  </div>

                  {/* Delivery charge */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      Delivery Fee: £{data.retailer.delivery_charge}{" "}
                      &nbsp;·&nbsp; Free delivery threshold: £
                      {data.retailer.free_delivery_threshold}
                    </span>
                  </div>
                </div>

                {/* Delivery areas */}
                {data.retailer.delivery_areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    {data.retailer.delivery_areas.map((area) => (
                      <span
                        key={area}
                        className="text-xs font-medium bg-primary/8 text-primary px-2.5 py-0.5 rounded-full border border-primary/15"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Total products badge */}
              <div className="hidden sm:flex flex-col items-center justify-center bg-primary/5 border border-primary/15 rounded-2xl px-5 py-4 shrink-0 min-w-25">
                <span className="text-3xl font-bold text-primary">
                  {data.total_products}
                </span>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  Products
                </span>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0 self-start sm:self-center"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Edit Modal ── */}
        {data && (
          <EditBusinessProfileModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            retailer={data.retailer}
          />
        )}

        {/* ── Products Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              My Products
              {!isLoading && data && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filteredProducts.length}
                  {searchQuery ? ` of ${data.total_products}` : ""})
                </span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-500 text-sm font-medium">
              Failed to load products. Please refresh the page.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <PackageOpen className="w-14 h-14" />
              <p className="text-base font-medium">
                {searchQuery
                  ? "No products match your search."
                  : "No products yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <BusinessProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
