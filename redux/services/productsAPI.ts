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
    currency: "₹",
    image: getFullImageUrl(apiProduct.image_url),
    stock: apiProduct.quantity,
    rating: parseFloat(apiProduct.average_rating),
    reviewsCount: apiProduct.total_reviews,
    description: apiProduct.description,
    availableProduct: apiProduct.quantity,
  };
};

export const productsAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with pagination
    getAllProducts: builder.query<
      { products: Product[]; totalCount: number },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 12 }) => ({
        url: `/retailer/products/`,
        params: { page, limit },
      }),
      transformResponse: (response: ProductsResponse) => ({
        products: response.data.products.map(transformProduct),
        totalCount: response.data.total_count,
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
        image?: File;
      }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("market_price", data.market_price);
        formData.append("quantity", data.quantity.toString());
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
        image?: File;
      }
    >({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("market_price", data.market_price);
        formData.append("quantity", data.quantity.toString());

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
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsAPI;
