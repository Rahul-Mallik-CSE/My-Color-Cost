/** @format */

import { apiSlice } from "./apiSlice";

// Define types for the API response
export interface Order {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  total_amount: string;
  delivery_full_address: string;
  delivery_area: string;
  delivery_postal_code: string;
  delivery_phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
}

export interface OrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    orders: Order[];
    total_count: number;
  };
}

// Inject endpoints into the API slice
export const ordersAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders
    getOrders: builder.query<OrdersResponse, void>({
      query: () => "/retailer/orders/",
      providesTags: ["Product"],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetOrdersQuery } = ordersAPI;
