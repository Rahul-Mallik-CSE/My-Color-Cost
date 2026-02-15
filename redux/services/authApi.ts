/** @format */

// redux/services/authApi.ts
import { apiSlice } from "./apiSlice";

// ============================================
// REQUEST TYPES
// ============================================

export interface SignupRequest {
  role: "retailer";
  email: string;
  password: string;
  name: string;
  contact_number: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ProfileSetupRequest {
  business_name: string;
  delivery_charge: string;
  free_delivery_threshold: string;
  delivery_areas: string[];
  api_key: string;
}

export interface ProfileSetupResponseData {
  message: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface SignupResponseData {
  email: string;
  name: string;
  otp: string;
  account_type: string | null;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  account_type?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: UserData;
}

export interface ForgotPasswordResponseData {
  email: string;
}

// ============================================
// AUTH API ENDPOINTS
// ============================================

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Signup endpoint - POST /auth/signup/
    signup: builder.mutation<ApiResponse<SignupResponseData>, SignupRequest>({
      query: (data) => ({
        url: "/auth/signup/",
        method: "POST",
        body: data,
      }),
    }),

    // Login endpoint - POST /auth/login/
    login: builder.mutation<ApiResponse<AuthTokens>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify OTP endpoint - POST /auth/verify-otp/
    verifyOtp: builder.mutation<ApiResponse<AuthTokens>, VerifyOtpRequest>({
      query: (otpData) => ({
        url: "/auth/verify-otp/",
        method: "POST",
        body: otpData,
      }),
    }),

    // Forgot Password endpoint - POST /auth/forgot-password/
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponseData>,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password endpoint - POST /auth/reset-password/
    resetPassword: builder.mutation<ApiResponse<null>, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password/",
        method: "POST",
        body: data,
      }),
    }),

    // Resend OTP endpoint - POST /auth/resend-otp/
    resendOtp: builder.mutation<
      ApiResponse<SignupResponseData>,
      ResendOtpRequest
    >({
      query: (data) => ({
        url: "/auth/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),

    // Logout endpoint
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<UserData>, void>({
      query: () => "/auth/me/",
      providesTags: ["Auth"],
    }),

    // Profile Setup endpoint - POST /retailer/profile/setup/
    profileSetup: builder.mutation<
      ApiResponse<ProfileSetupResponseData>,
      ProfileSetupRequest
    >({
      query: (data) => ({
        url: "/retailer/profile/setup/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useProfileSetupMutation,
} = authApi;
