/** @format */

import { z } from "zod";

// Login Validation schema
export const loginValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(2, "Password must be at least 2 characters")
    .max(100, "Password must be less than 100 characters")
    .trim()
    .refine((val) => !/\s/.test(val), {
      message: "Password cannot contain spaces",
    }),
  rememberMe: z.boolean(),
});

// Sign up Validation schema
export const signupValidationSchema = z
  .object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      )
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters")
      .trim(),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      )
      .refine((val) => !/\s/.test(val), {
        message: "Password cannot contain spaces",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .min(1, "Contact number is required")
      .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Reset Password Validation schema
export const resetPasswordValidationSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters")
      .trim(),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      )
      .refine((val) => !/\s/.test(val), {
        message: "New password cannot contain spaces",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Email Validation schema
export const emailValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .trim(),
});

// Change Password Validation schema
export const passwordValidationSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required").trim(),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      )
      .refine((val) => !/\s/.test(val), {
        message: "New password cannot contain spaces",
      }),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .refine((val) => !/\s/.test(val), {
        message: "Confirm password cannot contain spaces",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile Setup Validation schema
export const profileSetupValidationSchema = z.object({
  business_name: z
    .string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must be less than 100 characters")
    .trim(),
  delivery_charge: z
    .string()
    .min(1, "Delivery charge is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount (e.g., 50.00)")
    .refine((val) => parseFloat(val) >= 0, {
      message: "Delivery charge must be a positive number",
    }),
  free_delivery_threshold: z
    .string()
    .min(1, "Free delivery threshold is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount (e.g., 1000.00)")
    .refine((val) => parseFloat(val) >= 0, {
      message: "Free delivery threshold must be a positive number",
    }),
  delivery_areas: z
    .string()
    .min(1, "Delivery areas are required")
    .refine((val) => val.split(",").filter((area) => area.trim()).length > 0, {
      message: "Please enter at least one delivery area",
    }),
  api_key: z.string().min(1, "API key is required").trim(),
});
