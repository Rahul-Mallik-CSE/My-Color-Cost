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

      <div className="flex flex-col gap-6 p-3 sm:gap-8 sm:p-4 md:p-8">
        {/* ── Business Profile Header Card ── */}
        {isLoading ? (
          <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:p-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="h-20 w-20 shrink-0 rounded-2xl bg-gray-200 sm:h-24 sm:w-24" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-40 rounded bg-gray-200 sm:w-48" />
                <div className="h-4 w-32 rounded bg-gray-200 sm:w-36" />
                <div className="h-4 w-full max-w-64 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-500 text-sm font-medium">
            Failed to load business profile. Please try again.
          </div>
        ) : data ? (
          <div className="rounded-2xl border border-gray-100/60 bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 xl:items-center xl:gap-6">
                {/* Logo */}
                <div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm sm:mx-0 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
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
                <div className="w-full min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl md:text-3xl">
                    {data.retailer.business_name}
                  </h1>

                  <div className="mt-3 flex flex-col gap-3 sm:gap-4">
                    {/* Email */}
                    <div className="flex min-w-0 items-start gap-1.5 text-sm text-gray-500 sm:items-center">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <span className="min-w-0 break-all leading-relaxed">
                        {data.retailer.retailer_email}
                      </span>
                    </div>

                    {/* Delivery charge */}
                    <div className="flex min-w-0 items-start gap-1.5 text-sm text-gray-500 sm:items-center">
                      <Truck className="w-4 h-4 text-primary shrink-0" />
                      <span className="leading-relaxed">
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
                          className="max-w-full rounded-full border border-primary/15 bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop controls (original style) */}
                <div className="hidden min-w-25 shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 xl:flex">
                  <span className="text-3xl font-bold text-primary">
                    {data.total_products}
                  </span>
                  <span className="mt-1 text-xs font-medium text-gray-500">
                    Products
                  </span>
                </div>

                <button
                  onClick={() => setEditOpen(true)}
                  className="hidden shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 xl:flex"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:hidden">
                {/* Total products badge */}
                <div className="flex w-full items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 sm:w-auto sm:gap-3 sm:justify-center">
                  <span className="text-sm font-medium text-gray-500 sm:hidden">
                    Products
                  </span>
                  <span className="text-xl font-bold text-primary sm:text-3xl">
                    {data.total_products}
                  </span>
                  <span className="hidden text-xs font-medium text-gray-500 sm:inline">
                    Products
                  </span>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              My Products
              {!isLoading && data && (
                <span className="ml-2 whitespace-nowrap text-sm font-normal text-gray-400">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
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
