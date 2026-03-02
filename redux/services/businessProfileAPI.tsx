/** @format */

import { apiSlice } from "./apiSlice";
import { ProductAPI } from "@/types/product";
import { getFullImageUrl } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface RetailerProfile {
  id: number;
  business_name: string;
  business_logo_url: string;
  retailer_email: string;
  delivery_charge: string;
  free_delivery_threshold: string;
  delivery_areas: string[];
}

export interface BusinessProfileProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  vat: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  stock: number;
}

export interface BusinessProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    retailer: RetailerProfile;
    products: ProductAPI[];
    total_products: number;
  };
}

export interface BusinessProfile {
  retailer: RetailerProfile;
  products: BusinessProfileProduct[];
  total_products: number;
}

// ============================================
// TRANSFORM HELPER
// ============================================

const transformProduct = (p: ProductAPI): BusinessProfileProduct => ({
  id: p.id.toString(),
  title: p.name,
  description: p.description,
  image: getFullImageUrl(p.image_url),
  price: parseFloat(p.market_price),
  vat: parseFloat(p.vat),
  currency: "£",
  rating: parseFloat(p.average_rating),
  reviewsCount: p.total_reviews,
  stock: p.quantity,
});

// ============================================
// API SLICE
// ============================================

export const businessProfileAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => "/retailer/my-profile/",
      transformResponse: (response: BusinessProfileResponse) => ({
        retailer: {
          ...response.data.retailer,
          business_logo_url: getFullImageUrl(
            response.data.retailer.business_logo_url,
          ),
        },
        products: response.data.products.map(transformProduct),
        total_products: response.data.total_products,
      }),
    }),
  }),
});

export const { useGetBusinessProfileQuery } = businessProfileAPI;
