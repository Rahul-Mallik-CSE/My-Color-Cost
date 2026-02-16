/** @format */

import { apiSlice } from "./apiSlice";

// Define types for the API response
export interface Payment {
  id: number;
  customer_name: string;
  customer_email: string;
  payment_date: string;
  total_transfer_amount: string;
  transfer_status: string;
  transfer_id: string | null;
}

export interface PaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    payments: Payment[];
    total_count: number;
    total_earnings: number;
  };
}

// Inject endpoints into the API slice
export const paymentsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payments
    getPayments: builder.query<PaymentsResponse, void>({
      query: () => "/retailer/payments/",
      providesTags: ["Product"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPaymentsQuery } = paymentsAPI;
