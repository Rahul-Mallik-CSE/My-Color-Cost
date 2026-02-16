/** @format */

"use client";

import DashboardHeader from "@/components/Shared/DashboardHeader";
import { StatsCard } from "@/components/Shared/StatsCard";
import SalesDetailsChart from "@/components/(Dashboard)/Dashboard/SalesDetailsChart";
import OrderDetailsTable from "@/components/(Dashboard)/Dashboard/OrderDetailsTable";
import { useGetDashboardStatsQuery } from "@/redux/services/dashboardAPI";
import { useGetOrdersQuery } from "@/redux/services/ordersAPI";
import { IoMdCloseCircle } from "react-icons/io";
import { LineChart, History } from "lucide-react";

export default function DashboardPage() {
  const { data: statsResponse, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetOrdersQuery();

  // Transform API data to stats format
  const statsData = statsResponse?.data
    ? [
        {
          title: "Total Order",
          value: statsResponse.data.total_orders.toString(),
          imageIcon: "/icons/box.svg",
          iconColor: "#7438FF",
          iconBgColor: "#e1d5ff",
        },
        {
          title: "Total Sales",
          value: `$${parseFloat(statsResponse.data.total_sales).toFixed(2)}`,
          icon: LineChart,
          iconColor: "#4AD991",
          iconBgColor: "#d9f7e7",
        },
        {
          title: "Total Pending",
          value: `$${parseFloat(statsResponse.data.total_pending).toFixed(2)}`,
          icon: History,
          iconColor: "#FEC12C",
          iconBgColor: "#FDF1E2",
        },
        {
          title: "Order Cancel",
          value: statsResponse.data.total_cancelled.toString(),
          icon: IoMdCloseCircle,
          iconColor: "#E21B1B",
          iconBgColor: "#f8cfcf",
        },
      ]
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Retailer Dashboard" />

      <div className="p-4 md:p-8 flex flex-col gap-4 sm:gap-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsLoading
            ? // Show skeleton loaders
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white px-4 py-4 sm:px-6 sm:py-6 rounded-xl h-32 animate-pulse border shadow-[6px_6px_54px_0px_#0000000D]"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
              ))
            : statsData.map((data, index) => (
                <StatsCard key={index} {...data} />
              ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {/* Sales Chart */}
          <SalesDetailsChart />

          {/* Table */}
          <OrderDetailsTable
            title="Order Details"
            orders={ordersResponse?.data.orders || []}
            totalCount={ordersResponse?.data.total_count || 0}
            isLoading={ordersLoading}
            itemsPerPage={10}
            enablePagination={false}
          />
        </div>
      </div>
    </div>
  );
}
