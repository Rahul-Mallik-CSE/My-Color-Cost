/** @format */

"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useGetSalesChartQuery } from "@/redux/services/salesChartAPI";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function SalesDetailsChart() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: chartResponse, isLoading } =
    useGetSalesChartQuery(selectedYear);

  // Map API response to chart data format
  const chartData =
    chartResponse?.data?.labels?.map((label, index) => ({
      name: label,
      value: parseFloat(chartResponse.data.sales[index] ?? "0"),
      orders: chartResponse.data.orders[index] ?? 0,
    })) ?? [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-[6px_6px_54px_0px_#0000000D] w-full h-[300px] sm:h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Sales Details
        </h2>

        {/* Year dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white border border-border rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50"
          >
            {selectedYear}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-border rounded-lg shadow-lg z-10 overflow-hidden">
              {YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    selectedYear === year
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-[250px] sm:h-[350px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4880FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4880FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#EAEAEA"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `£${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div
                        style={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                          background: "#fff",
                          padding: "10px 14px",
                          fontSize: 13,
                        }}
                      >
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>
                          {label}
                        </p>
                        <p style={{ color: "#4880FF" }}>
                          Sales: £{d.value.toFixed(2)}
                        </p>
                        <p style={{ color: "#6B7280" }}>Orders: {d.orders}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4880FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#4880FF" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
