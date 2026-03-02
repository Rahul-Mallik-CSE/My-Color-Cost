/** @format */

"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  RetailerProfile,
  useUpdateBusinessProfileMutation,
} from "@/redux/services/businessProfileAPI";

// ── Schema ──────────────────────────────────────────────
const schema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  delivery_charge: z
    .string()
    .min(1, "Delivery charge is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount e.g. 50.00"),
  free_delivery_threshold: z
    .string()
    .min(1, "Free delivery threshold is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount e.g. 1000.00"),
  business_logo: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Props ────────────────────────────────────────────────
interface EditBusinessProfileModalProps {
  open: boolean;
  onClose: () => void;
  retailer: RetailerProfile;
}

// ── Component ────────────────────────────────────────────
export default function EditBusinessProfileModal({
  open,
  onClose,
  retailer,
}: EditBusinessProfileModalProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [updateProfile, { isLoading }] = useUpdateBusinessProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      business_name: retailer.business_name,
      delivery_charge: retailer.delivery_charge,
      free_delivery_threshold: retailer.free_delivery_threshold,
    },
  });

  // Re-seed form whenever modal opens
  useEffect(() => {
    if (open) {
      reset({
        business_name: retailer.business_name,
        delivery_charge: retailer.delivery_charge,
        free_delivery_threshold: retailer.free_delivery_threshold,
        business_logo: undefined,
      });
      startTransition(() => setLogoPreview(null));
    }
  }, [open, retailer, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo too large. Max 5MB.");
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
    setValue("business_logo", file, { shouldDirty: true });
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoPreview(null);
    setValue("business_logo", undefined);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile({
        business_name: data.business_name,
        delivery_charge: data.delivery_charge,
        free_delivery_threshold: data.free_delivery_threshold,
        business_logo: data.business_logo as File | undefined,
      }).unwrap();
      toast.success("Business profile updated successfully!");
      onClose();
    } catch (error) {
      const err = error as {
        data?: { message?: string; data?: Record<string, string[]> };
      };
      if (err?.data?.data && typeof err.data.data === "object") {
        Object.entries(err.data.data).forEach(([field, msgs]) => {
          const label =
            field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");
          const msg = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
          toast.error(`${label}: ${msg}`);
        });
      } else {
        toast.error(
          err?.data?.message ?? "Something went wrong. Please try again.",
        );
      }
    }
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-foreground">
            Edit Business Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-foreground hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          {/* Business Logo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              Business Logo
              <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />

            <div
              onClick={() => logoInputRef.current?.click()}
              className="relative border-2 border-dashed border-gray-200 rounded-2xl h-32 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all overflow-hidden group"
            >
              {/* Show new preview, else current logo */}
              {logoPreview || retailer.business_logo_url ? (
                <>
                  <Image
                    src={logoPreview ?? retailer.business_logo_url}
                    alt="Logo preview"
                    fill
                    className="object-contain p-3 group-hover:opacity-75 transition-opacity"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <p className="text-white text-sm font-medium">
                      Click to replace
                    </p>
                    {logoPreview && (
                      <button
                        onClick={removeLogo}
                        className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImageIcon className="w-9 h-9" />
                  <p className="text-sm font-medium">Click to upload logo</p>
                  <p className="text-xs">PNG, JPG, SVG or GIF (max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              {...register("business_name")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-sm font-medium"
              placeholder="Your business name"
            />
            {errors.business_name && (
              <p className="text-xs text-red-500">
                {errors.business_name.message}
              </p>
            )}
          </div>

          {/* Delivery Charge */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Delivery Charge (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                £
              </span>
              <input
                type="text"
                {...register("delivery_charge")}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-sm font-medium"
                placeholder="50.00"
              />
            </div>
            {errors.delivery_charge && (
              <p className="text-xs text-red-500">
                {errors.delivery_charge.message}
              </p>
            )}
          </div>

          {/* Free Delivery Threshold */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Free Delivery Threshold (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                £
              </span>
              <input
                type="text"
                {...register("free_delivery_threshold")}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-sm font-medium"
                placeholder="1000.00"
              />
            </div>
            {errors.free_delivery_threshold && (
              <p className="text-xs text-red-500">
                {errors.free_delivery_threshold.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
