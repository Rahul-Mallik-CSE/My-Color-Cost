/** @format */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, MapPin, Key } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import {
  useProfileSetupMutation,
  useLoginProfileSetupMutation,
} from "@/redux/services/authApi";
import { toast } from "sonner";
import { profileSetupValidationSchema } from "@/lib/formDataValidation";
import { useRouter, useSearchParams } from "next/navigation";

type FormValues = z.infer<typeof profileSetupValidationSchema>;

export default function ProfileSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "signup";

  // RTK Query mutations for both flows
  const [profileSetup, { isLoading: isSignupLoading }] =
    useProfileSetupMutation();
  const [loginProfileSetup, { isLoading: isLoginLoading }] =
    useLoginProfileSetupMutation();

  const isLoading = isSignupLoading || isLoginLoading;

  // Check if user has valid context on mount
  useEffect(() => {
    if (flow === "login") {
      // Login flow: check for email in sessionStorage
      const email = sessionStorage.getItem("profileSetupEmail");
      console.log(
        "🔍 Login flow - Checking email:",
        email ? "Found" : "Not found",
      );

      if (!email) {
        console.log(
          "⚠️ No email found for login flow, redirecting to signin...",
        );
        toast.error("Please login first");
        router.push("/signin");
      } else {
        console.log(
          "✅ Email found, user can proceed with profile setup (login flow)",
        );
      }
    } else {
      // Signup flow: check for setup token
      const setupToken = localStorage.getItem("setupAccessToken");
      console.log(
        "🔍 Signup flow - Checking setup token:",
        setupToken ? "Found" : "Not found",
      );

      if (!setupToken) {
        console.log("⚠️ No setup token found, redirecting to signin...");
        toast.error("Please verify your email first");
        router.push("/signin");
      } else {
        console.log(
          "✅ Setup token found, user can proceed with profile setup (signup flow)",
        );
      }
    }
  }, [router, flow]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSetupValidationSchema),
    defaultValues: {
      business_name: "",
      delivery_charge: "",
      free_delivery_threshold: "",
      delivery_areas: "",
      api_key: undefined,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("🏢 Attempting profile setup with:", {
        business_name: data.business_name,
        flow,
      });

      // Convert delivery_areas from comma-separated string to array
      const deliveryAreasArray = data.delivery_areas
        .split(",")
        .map((area) => area.trim())
        .filter((area) => area.length > 0);

      let response;

      if (flow === "login") {
        // Login flow: use /retailer/retailer/profile/setup/ with email
        const email = sessionStorage.getItem("profileSetupEmail") || "";
        response = await loginProfileSetup({
          email,
          business_name: data.business_name,
          delivery_charge: data.delivery_charge,
          free_delivery_threshold: data.free_delivery_threshold,
          delivery_areas: deliveryAreasArray,
          api_key: data.api_key,
        }).unwrap();
      } else {
        // Signup flow: use /retailer/profile/setup/ (existing)
        response = await profileSetup({
          business_name: data.business_name,
          delivery_charge: data.delivery_charge,
          free_delivery_threshold: data.free_delivery_threshold,
          delivery_areas: deliveryAreasArray,
          api_key: data.api_key,
        }).unwrap();
      }

      console.log("✅ Profile setup response:", response);

      toast.success(
        response.message || "Profile setup completed successfully!",
      );

      if (flow === "login") {
        // Clear sessionStorage for login flow
        console.log("🧹 Clearing sessionStorage login flow data...");
        sessionStorage.removeItem("profileSetupEmail");
        sessionStorage.removeItem("profileSetupFlow");
      } else {
        // Clear localStorage tokens (signup flow)
        console.log("🧹 Clearing localStorage setup tokens...");
        localStorage.removeItem("setupAccessToken");
        localStorage.removeItem("setupRefreshToken");
        localStorage.removeItem("setupUserEmail");
        localStorage.removeItem("setupUserName");
      }

      console.log("🔄 Redirecting to login...");
      // Redirect to login page
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error: unknown) {
      console.error("❌ Profile setup error:", error);
      const apiError = error as {
        data?: { message?: string; success?: boolean };
        status?: number;
        error?: string;
      };

      if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else if (apiError?.error) {
        toast.error(apiError.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-linear-to-b from-[#ff6c95] to-[#e993fd]  ">
      {/* Background Shape */}
      {/* <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/icons/shape.png"
          alt="Background Shape"
          fill
          className="object-cover"
          priority
        />
      </div> */}

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full px-4 md:px-0 flex items-center justify-center"
      >
        <Card
          className="w-full max-w-[900px] bg-white border border-[#DDDDDD] rounded-[24px] p-0"
          style={{
            boxShadow:
              "0px 5px 11px 0px #0000000D, 0px 19px 19px 0px #0000000D, 0px 43px 26px 0px #0000000D, 0px 77px 31px 0px #00000003, 0px 120px 34px 0px #00000000",
          }}
        >
          <CardContent className="p-8 md:p-[40px]">
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/color-cost-logo.png"
                alt="Register Icon"
                width={160}
                height={120}
                className=""
                priority
              />
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Profile Setup
                </h1>
                <p className="text-gray-500 text-sm md:text-base">
                  Complete your business profile to get started
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-4"
              >
                {/* Business Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="business_name"
                    className="text-xl font-normal text-foreground flex items-center gap-2"
                  >
                    <Building2 className="w-5 h-5 text-gray-500" />
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Enter your business name..."
                    className={`h-14 rounded-xl text-base ${
                      errors.business_name
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "text-foreground border-[#3B3B3B]"
                    }`}
                    {...register("business_name")}
                  />
                  {errors.business_name && (
                    <p className="text-sm text-red-500">
                      {errors.business_name.message}
                    </p>
                  )}
                </div>

                {/* Delivery Charge & Free Delivery Threshold */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Delivery Charge Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="delivery_charge"
                      className="text-lg font-normal text-foreground"
                    >
                      Delivery Charge
                    </Label>
                    <p className="text-xs">
                      Tip: We recommend setting a delivery fee of no more than
                      £3.
                    </p>
                    <Input
                      id="delivery_charge"
                      type="text"
                      placeholder="50.00"
                      className={`h-14 rounded-xl text-base ${
                        errors.delivery_charge
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "text-foreground border-[#3B3B3B]"
                      }`}
                      {...register("delivery_charge")}
                    />
                    {errors.delivery_charge && (
                      <p className="text-sm text-red-500">
                        {errors.delivery_charge.message}
                      </p>
                    )}
                  </div>

                  {/* Free Delivery Threshold Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="free_delivery_threshold"
                      className="text-lg font-normal text-foreground"
                    >
                      Free delivery minimum threshold
                    </Label>
                    <p className="text-xs">
                      Tip: We recommend keeping your free delivery minimum
                      threshold between £50 - £100. The lower the better for our
                      hairstylists and more fulfilled orders.
                    </p>
                    <Input
                      id="free_delivery_threshold"
                      type="text"
                      placeholder="1000.00"
                      className={`h-14 rounded-xl text-base ${
                        errors.free_delivery_threshold
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "text-foreground border-[#3B3B3B]"
                      }`}
                      {...register("free_delivery_threshold")}
                    />
                    {errors.free_delivery_threshold && (
                      <p className="text-sm text-red-500">
                        {errors.free_delivery_threshold.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Areas Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="delivery_areas"
                    className="text-xl font-normal text-foreground flex items-center gap-2"
                  >
                    <MapPin className="w-5 h-5 text-gray-500" />
                    Delivery Areas
                  </Label>
                  <Input
                    id="delivery_areas"
                    type="text"
                    placeholder="Gulshan, Banani, Dhanmondi"
                    className={`h-14 rounded-xl text-base ${
                      errors.delivery_areas
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "text-foreground border-[#3B3B3B]"
                    }`}
                    {...register("delivery_areas")}
                  />
                  <p className="text-xs text-gray-500">
                    Separate multiple areas with commas
                  </p>
                  {errors.delivery_areas && (
                    <p className="text-sm text-red-500">
                      {errors.delivery_areas.message}
                    </p>
                  )}
                </div>

                {/* API Key Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="api_key"
                    className="text-xl font-normal text-foreground flex items-center gap-2"
                  >
                    <Key className="w-5 h-5 text-gray-500" />
                    API Key(optional)
                  </Label>
                  <Input
                    id="api_key"
                    type="text"
                    placeholder="Enter your API key..."
                    className={`h-14 rounded-xl text-base`}
                    {...register("api_key")}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-none mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Setting up profile...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
