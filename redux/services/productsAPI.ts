/** @format */

// redux/services/productsAPI.ts
import { apiSlice } from "./apiSlice";
import { ProductsResponse, ProductAPI, Product } from "@/types/product";
import { getFullImageUrl } from "@/lib/utils";

// Helper function to transform API product to frontend product
const transformProduct = (apiProduct: ProductAPI): Product => {
  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    price: parseFloat(apiProduct.market_price),
    discountedPrice: apiProduct.discounted_market_price
      ? parseFloat(apiProduct.discounted_market_price)
      : undefined,
    currency: "£",
    image: getFullImageUrl(apiProduct.image_url),
    stock: apiProduct.quantity,
    rating: parseFloat(apiProduct.average_rating),
    reviewsCount: apiProduct.total_reviews,
    description: apiProduct.description,
    availableProduct: apiProduct.quantity,
    vat: parseFloat(apiProduct.vat),
    promoIsActive: apiProduct.promo_is_active,
    promoBuyQuantity: apiProduct.promo_buy_quantity,
    promoFreeQuantity: apiProduct.promo_free_quantity,
    stockStatus: apiProduct.stock_status,
  };
};

export const productsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Stripe connection status
    getStripeStatus: builder.query<
      {
        stripe_connected: boolean;
        stripe_connection_status: string;
        stripe_account_id: string | null;
        connection_date: string | null;
      },
      void
    >({
      query: () => `/retailer/stripe/status/`,
      transformResponse: (response: {
        data: {
          stripe_connected: boolean;
          stripe_connection_status: string;
          stripe_account_id: string | null;
          connection_date: string | null;
        };
      }) => response.data,
    }),

    // Get all products with pagination
    getAllProducts: builder.query<
      { products: Product[]; totalCount: number; apiKey: string | null },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `/retailer/products/`,
        params: { page, limit },
      }),
      transformResponse: (response: ProductsResponse) => ({
        products: response.data.products.map(transformProduct),
        totalCount: response.data.total_count,
        apiKey: response.data.api_key ?? null,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Get single product by ID
    getProduct: builder.query<Product, string>({
      query: (id) => `/retailer/products/${id}/`,
      transformResponse: (response: { data: ProductAPI }) =>
        transformProduct(response.data),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Create new product
    createProduct: builder.mutation<
      ProductAPI,
      {
        name: string;
        description: string;
        market_price: string;
        quantity: number;
        vat: string;
        image?: File;
      }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("market_price", data.market_price);
        formData.append("quantity", data.quantity.toString());
        formData.append("vat", data.vat);
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: `/retailer/products/create/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Update existing product
    updateProduct: builder.mutation<
      ProductAPI,
      {
        id: string;
        name: string;
        description: string;
        market_price: string;
        quantity: number;
        vat: string;
        image?: File;
      }
    >({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("market_price", data.market_price);
        formData.append("quantity", data.quantity.toString());
        formData.append("vat", data.vat);

        console.log("🔧 API Mutation - updateProduct:", {
          id,
          hasImage: !!data.image,
          imageType: data.image ? typeof data.image : "undefined",
          imageIsFile: data.image instanceof File,
          imageName: data.image?.name,
          imageSize: data.image?.size,
        });

        if (data.image) {
          formData.append("image", data.image);
          console.log("✅ Image appended to FormData");
        } else {
          console.log("⚠️ No image to append");
        }

        return {
          url: `/retailer/products/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/retailer/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Get bulk discount history
    getBulkDiscount: builder.query<
      {
        history: {
          discount_type: "amount" | "percentage";
          discount_value: string;
          products_affected: number;
          products_skipped: number;
          applied_at: string;
        }[];
      },
      void
    >({
      query: () => `/retailer/retailer/products/bulk-discount/`,
      transformResponse: (response: {
        data: {
          history: {
            discount_type: "amount" | "percentage";
            discount_value: string;
            products_affected: number;
            products_skipped: number;
            applied_at: string;
          }[];
        };
      }) => response.data,
      providesTags: ["BulkDiscount"],
    }),

    // Apply bulk discount
    applyBulkDiscount: builder.mutation<
      void,
      { discount_type: "amount" | "percentage"; discount_value: number }
    >({
      query: (data) => ({
        url: `/retailer/retailer/products/bulk-discount/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BulkDiscount", { type: "Product", id: "LIST" }],
    }),

    // Apply individual product discount
    applyProductDiscount: builder.mutation<
      void,
      {
        id: string;
        discount_type: "amount" | "percentage";
        discount_value: number;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/retailer/retailer/products/${id}/discount/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Remove bulk discount (all products)
    removeBulkDiscount: builder.mutation<void, void>({
      query: () => ({
        url: `/retailer/retailer/products/bulk-discount/`,
        method: "DELETE",
        body: { product_ids: [] },
      }),
      invalidatesTags: ["BulkDiscount", { type: "Product", id: "LIST" }],
    }),

    // Remove individual product discount
    removeProductDiscount: builder.mutation<
      {
        product_id: number;
        product_name: string;
        market_price: string;
        discount_removed: boolean;
      },
      string
    >({
      query: (id) => ({
        url: `/retailer/retailer/products/${id}/discount/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Apply bulk promo
    applyBulkPromo: builder.mutation<
      {
        products_affected: number;
        promo_label: string;
        scope: string;
      },
      { promo_buy_quantity: number; promo_free_quantity: number }
    >({
      query: (data) => ({
        url: `/retailer/retailer/promos/bulk/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Remove bulk promo
    removeBulkPromo: builder.mutation<{ products_affected: number }, void>({
      query: () => ({
        url: `/retailer/retailer/promos/bulk/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Apply promo for selected products
    applySelectedProductsPromo: builder.mutation<
      {
        products_affected: number;
        promo_label: string;
        scope: string;
      },
      {
        promo_buy_quantity: number;
        promo_free_quantity: number;
        product_ids: number[];
      }
    >({
      query: (data) => ({
        url: `/retailer/retailer/promos/bulk/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Remove promo for selected products
    removeSelectedProductsPromo: builder.mutation<
      { products_affected: number },
      { product_ids: number[] }
    >({
      query: (data) => ({
        url: `/retailer/retailer/promos/bulk/`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Apply product-specific promo
    applyProductPromo: builder.mutation<
      {
        product_id: number;
        product_name: string;
        promo_label: string;
        promo_is_active: boolean;
      },
      {
        productId: string;
        promo_buy_quantity: number;
        promo_free_quantity: number;
      }
    >({
      query: ({ productId, ...data }) => ({
        url: `/retailer/retailer/promos/product/${productId}/`,
        method: "POST",
        body: {
          promo_buy_quantity: data.promo_buy_quantity,
          promo_free_quantity: data.promo_free_quantity,
        },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Remove product-specific promo
    removeProductPromo: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/retailer/retailer/promos/product/${productId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStripeStatusQuery,
  useGetAllProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetBulkDiscountQuery,
  useApplyBulkDiscountMutation,
  useRemoveBulkDiscountMutation,
  useApplyProductDiscountMutation,
  useRemoveProductDiscountMutation,
  useApplyBulkPromoMutation,
  useRemoveBulkPromoMutation,
  useApplySelectedProductsPromoMutation,
  useRemoveSelectedProductsPromoMutation,
  useApplyProductPromoMutation,
  useRemoveProductPromoMutation,
} = productsAPI;
