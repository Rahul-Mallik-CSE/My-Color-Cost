/** @format */

import { apiSlice } from "./apiSlice";

// Define types for the API response
export interface DashboardStats {
  total_orders: number;
  total_sales: string;
  total_pending: string;
  total_cancelled: number;
  total_products: number;
  out_of_stock_count: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardStats;
}

// Inject endpoints into the API slice
export const dashboardAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard stats
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/retailer/dashboard/",
      providesTags: ["Product"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetDashboardStatsQuery } = dashboardAPI;
