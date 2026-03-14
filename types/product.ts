/** @format */

// API Response type
export interface ProductAPI {
  id: number;
  name: string;
  description: string;
  image_url: string;
  market_price: string;
  discounted_market_price: string;
  quantity: number;
  stock_status: string;
  vat: string;
  retailer_name: string;
  average_rating: string;
  total_reviews: number;
  promo_is_active: boolean;
  promo_buy_quantity: number | null;
  promo_free_quantity: number | null;
  created_at: string;
  updated_at: string;
}

// Frontend Product type (transformed from API)
export interface Product {
  id: string;
  title: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  image: string;
  stock: number | string;
  rating: number;
  reviewsCount: number;
  description?: string;
  category?: string;
  availableProduct?: number;
  vat?: number;
  promoIsActive?: boolean;
  promoBuyQuantity?: number | null;
  promoFreeQuantity?: number | null;
  stockStatus?: string;
}

// API Response wrapper
export interface ProductsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    products: ProductAPI[];
    total_count: number;
    api_key: string | null;
  };
}
