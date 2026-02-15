/** @format */

"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/redux/services/authApi";
import { toast } from "sonner";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type FormValues = z.infer<typeof otpSchema>;

const VerifyOtp = () => {
  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") || "signup";

  // RTK Query mutations
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Get email from sessionStorage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verifyEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("No email found. Please start the process again.");
      router.push(flow === "reset" ? "/forgot-password" : "/signup");
    }
  }, [flow, router]);

  const onSubmit = async (data: FormValues) => {
    if (!email) {
      toast.error("No email found. Please start the process again.");
      return;
    }

    try {
      const response = await verifyOtp({
        email: email,
        otp_code: data.otp,
      }).unwrap();

      console.log("📦 Full OTP verification response:", response);
      console.log("✅ Success status:", response.success);
      console.log("📧 Flow:", flow);

      if (response.success) {
        toast.success("Verification successful! Please setup your profile!");

        if (flow === "reset") {
          // For password reset flow, store OTP and redirect to reset password
          sessionStorage.setItem("resetOtp", data.otp);
          router.push("/reset-password");
        } else {
          // For signup flow, save tokens to localStorage (not cookies)
          // User needs to complete profile setup before being fully authenticated

          console.log("📊 Response data:", response.data);

          if (!response.data || !response.data.access || !response.data.user) {
            console.error("❌ Invalid response structure:", response);
            toast.error("Invalid response from server");
            return;
          }

          const { access, refresh, user } = response.data;

          console.log("💾 Saving tokens to localStorage...");
          console.log("📧 User email:", user.email);
          console.log("👤 User name:", user.name);

          // Save tokens to localStorage temporarily
          localStorage.setItem("setupAccessToken", access);
          localStorage.setItem("setupRefreshToken", refresh);
          localStorage.setItem("setupUserEmail", user.email);
          localStorage.setItem("setupUserName", user.name);

          // Verify localStorage was set
          const savedToken = localStorage.getItem("setupAccessToken");
          console.log(
            "✅ Token saved verification:",
            savedToken ? "Success" : "Failed",
          );

          // Clear sessionStorage
          sessionStorage.removeItem("verifyEmail");
          sessionStorage.removeItem("otpFlow");

          console.log(
            "💾 Tokens saved to localStorage, redirecting to profile setup...",
          );
          console.log("🔄 Navigating to /profile-setup");

          // Redirect to profile setup page
          router.push("/profile-setup");

          console.log("✅ router.push() called - should navigate now");
        }
      } else {
        toast.error(
          response.message || "Verification failed. Please try again.",
        );
      }
    } catch (error: unknown) {
      console.error("Verification failed:", error);
      const apiError = error as {
        data?: { message?: string };
        status?: number;
      };
      if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  };

  const onResend = async () => {
    if (!email) {
      toast.error("No email found. Please start the process again.");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendOtp({ email }).unwrap();
      if (response.success) {
        toast.success(
          response.message || "A new code has been sent to your email.",
        );
      } else {
        toast.error(response.message || "Failed to resend OTP.");
      }
    } catch (error: unknown) {
      console.error("Failed to resend OTP:", error);
      const apiError = error as {
        data?: { message?: string };
        status?: number;
      };
      if (apiError?.data?.message) {
        toast.error(apiError.data.message);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
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
          className="w-full max-w-[550px] bg-white border border-[#DDDDDD] rounded-[24px] p-0"
          style={{
            boxShadow:
              "0px 5px 11px 0px #0000000D, 0px 19px 19px 0px #0000000D, 0px 43px 26px 0px #0000000D, 0px 77px 31px 0px #00000003, 0px 120px 34px 0px #00000000",
          }}
        >
          <CardContent className="p-8 md:p-[40px]">
            {/* "Verify with OTP" matches uploaded_media_3. uploaded_media_1 says "Verify with Email". 
                 I'll stick with "Verify with OTP" as general purpose. */}
            <div className="flex flex-col items-center gap-4">
              <Image
                src="/color-cost-logo.png"
                alt="Register Icon"
                width={160}
                height={120}
                className=""
                priority
              />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                Verify with OTP
              </h1>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col items-center gap-8"
              >
                <div className="w-full flex justify-center">
                  <Controller
                    control={control}
                    name="otp"
                    render={({ field }) => (
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="gap-2 md:gap-4">
                          {/* Customizing slots to look like separate boxes */}
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-gray-300 first:rounded-xl last:rounded-xl text-lg md:text-xl"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-[-20px]">
                    {errors.otp.message}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>

                {/* Resend Link */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-normal text-foreground">
                    Don&apos;t receive the OTP?
                  </span>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={isResending}
                    className="text-base font-semibold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend"}
                  </button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
