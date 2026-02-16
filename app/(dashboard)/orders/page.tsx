/** @format */

"use client";

import { useState, useMemo } from "react";
import OrderDetailsTable from "@/components/(Dashboard)/Dashboard/OrderDetailsTable";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { useGetOrdersQuery } from "@/redux/services/ordersAPI";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: ordersResponse, isLoading } = useGetOrdersQuery();

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!ordersResponse?.data.orders) return [];

    if (!searchQuery.trim()) return ordersResponse.data.orders;

    const query = searchQuery.toLowerCase();
    return ordersResponse.data.orders.filter(
      (order) =>
        order.product_name.toLowerCase().includes(query) ||
        order.delivery_area.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query) ||
        order.total_amount.includes(query) ||
        order.customer_name.toLowerCase().includes(query),
    );
  }, [ordersResponse, searchQuery]);

  return (
    <>
      <DashboardHeader title="Retailer Dashboard" onSearch={setSearchQuery} />
      <div className="p-4 md:p-8 flex flex-col gap-4 sm:gap-5">
        <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-foreground">
          Order Lists
        </h2>
        <OrderDetailsTable
          itemsPerPage={12}
          title=""
          orders={filteredOrders}
          totalCount={filteredOrders.length}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
