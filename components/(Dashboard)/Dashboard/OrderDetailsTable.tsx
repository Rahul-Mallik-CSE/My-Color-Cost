/** @format */

"use client";

import { orders } from "@/data/orderData";
import { useState } from "react";
import { TablePagination } from "@/components/Shared/TablePagination";
import Image from "next/image";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-600";
    case "Pending":
      return "bg-orange-100 text-orange-400";
    case "Rejected":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";

export default function OrderDetailsTable({
  title = "Order Details",
  data = orders,
  itemsPerPage = 7,
  enablePagination = true,
  isLoading = false,
}: {
  title?: string;
  data?: typeof orders;
  itemsPerPage?: number;
  enablePagination?: boolean;
  isLoading?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Only show pagination if enabled AND there are more items than the page size
  const showPagination = enablePagination && totalItems > itemsPerPage;

  const currentData = showPagination
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-[6px_6px_54px_0px_#0000000D] w-full">
      {title && (
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6">
          {title}
        </h2>
      )}

      {isLoading ? (
        <TableSkeleton rowCount={itemsPerPage} />
      ) : currentData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] sm:min-w-[800px]">
              <thead>
                <tr className="bg-[#F1F4F9] text-left">
                  <th className="py-3 px-4 sm:py-4 sm:px-6 rounded-l-xl text-foreground font-semibold text-sm">
                    Product Name
                  </th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-foreground font-semibold text-sm">
                    Location
                  </th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-foreground font-semibold text-sm">
                    Date - Time
                  </th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-foreground font-semibold text-sm">
                    Quantity
                  </th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 text-foreground font-semibold text-sm">
                    Amount
                  </th>

                  <th className="py-3 px-4 sm:py-4 sm:px-6 rounded-r-xl text-foreground font-semibold text-sm text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-medium">
                      {order.productName}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {order.location}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {order.dateTime}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {order.piece}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-semibold">
                      {order.amount}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                      <span
                        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-10 sm:py-20 text-foreground flex flex-col items-center gap-4">
          <Image
            src="/images/empty-state.webp"
            alt="Empty State"
            width={150}
            height={150}
            className="sm:w-[200px] sm:h-[200px]"
          />
          <p>No order found.</p>
        </div>
      )}
    </div>
  );
}
