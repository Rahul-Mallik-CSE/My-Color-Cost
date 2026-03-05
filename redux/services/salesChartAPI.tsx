/** @format */

import { apiSlice } from "./apiSlice";

export interface SalesChartData {
  labels: string[];
  sales: string[];
  orders: number[];
}

export interface SalesChartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SalesChartData;
}

export const salesChartAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesChart: builder.query<SalesChartResponse, number>({
      query: (year) => `/payment/retailer/sales/chart/?year=${year}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetSalesChartQuery } = salesChartAPI;
