/** @format */

// redux/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { getCookie } from "@/lib/utils";

// Define the base URL for your API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

console.log("🌐 API Base URL:", baseUrl);

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include", // Include credentials for CORS
    mode: "cors", // Enable CORS mode
    // Prepare headers with authentication token
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state first
      const state = getState() as RootState;
      let token = state.auth.accessToken;

      // If no token in state, try to get from cookies as fallback
      if (!token) {
        token = getCookie("accessToken");
      }

      // If we have a token, include it in the headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    // Validate response status
    validateStatus: (response) => {
      // Treat 2xx status codes as successful
      return response.status >= 200 && response.status < 300;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ["User", "Auth", "Product"],
  // Define endpoints in separate files and inject them here
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {} = apiSlice;
