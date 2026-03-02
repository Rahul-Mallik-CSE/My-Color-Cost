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

// ============================================
// UPDATE REQUEST TYPE
// ============================================

export interface UpdateBusinessProfileRequest {
  business_name?: string;
  delivery_charge?: string;
  free_delivery_threshold?: string;
  business_logo?: File;
}

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
      providesTags: ["BusinessProfile" as never],
    }),

    updateBusinessProfile: builder.mutation<
      { success: boolean; message: string },
      UpdateBusinessProfileRequest
    >({
      query: (data) => {
        const formData = new FormData();
        if (data.business_name !== undefined)
          formData.append("business_name", data.business_name);
        if (data.delivery_charge !== undefined)
          formData.append("delivery_charge", data.delivery_charge);
        if (data.free_delivery_threshold !== undefined)
          formData.append(
            "free_delivery_threshold",
            data.free_delivery_threshold,
          );
        if (data.business_logo)
          formData.append("business_logo", data.business_logo);
        return {
          url: "/retailer/retailer/profile/setup/",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["BusinessProfile" as never],
    }),
  }),
});

export const { useGetBusinessProfileQuery, useUpdateBusinessProfileMutation } =
  businessProfileAPI;
