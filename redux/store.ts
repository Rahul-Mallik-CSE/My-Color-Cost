/** @format */

// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./features/authSlice";
import { getCookie } from "@/lib/utils";

// Function to get preloaded state from cookies
const getPreloadedState = () => {
  if (typeof window === "undefined") return undefined;

  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");
  const userEmail = getCookie("userEmail");
  const userName = getCookie("userName");
  const userRole = getCookie("userRole");

  if (accessToken && refreshToken && userEmail && userName) {
    return {
      auth: {
        user: {
          id: userEmail,
          email: userEmail,
          name: userName,
          role: userRole || "retailer",
        },
        accessToken,
        refreshToken,
        isAuthenticated: true,
      },
    };
  }

  return undefined;
};

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      // Add the API reducer
      [apiSlice.reducerPath]: apiSlice.reducer,
      // Add other reducers
      auth: authReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: getPreloadedState(),
  });

  // Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
  setupListeners(store.dispatch);

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
