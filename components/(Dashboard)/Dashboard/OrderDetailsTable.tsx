/** @format */

"use client";

import { useState, useMemo } from "react";
import { TablePagination } from "@/components/Shared/TablePagination";
import Image from "next/image";
import { Order } from "@/redux/services/ordersAPI";

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-600";
    case "pending":
      return "bg-orange-100 text-orange-400";
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Helper function to format date
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";

export default function OrderDetailsTable({
  title = "Order Details",
  orders = [],
  totalCount = 0,
  itemsPerPage = 12,
  enablePagination = true,
  isLoading = false,
}: {
  title?: string;
  orders?: Order[];
  totalCount?: number;
  itemsPerPage?: number;
  enablePagination?: boolean;
  isLoading?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Only show pagination if enabled AND total count is greater than items per page
  const showPagination = enablePagination && totalCount > itemsPerPage;

  // Calculate current page data
  const currentData = useMemo(() => {
    if (!showPagination) {
      return orders.slice(0, itemsPerPage);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, itemsPerPage, showPagination]);

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
                      {order.product_name}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {order.delivery_area}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                      {order.quantity}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-semibold">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                      <span
                        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
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
              totalItems={totalCount}
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
