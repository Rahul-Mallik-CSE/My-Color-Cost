/** @format */

// components\Dashboard\Profile\ProfileClient.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/services/settingAPI";
import { getFullImageUrl } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import { updateUser } from "@/redux/features/authSlice";

export default function ProfileClient() {
  // API hooks
  const dispatch = useAppDispatch();
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [activeSection, setActiveSection] = useState<
    "account" | "notifications" | "language"
  >("account");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Edit values
  const [editNameValue, setEditNameValue] = useState("");
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasChanges, setHasChanges] = useState(false);

  // Sync profile data with Redux auth state when loaded
  useEffect(() => {
    if (profileData) {
      console.log("📝 Syncing profile data to Redux:", profileData);
      dispatch(
        updateUser({
          name: profileData.name,
          email: profileData.email,
          image: profileData.image,
        }),
      );
    }
  }, [profileData, dispatch]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please select an image file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please select an image smaller than 5MB.",
        });
        return;
      }

      setSelectedImage(file);
      setHasChanges(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditName = () => {
    setEditNameValue(profileData?.name || "");
    setIsEditingName(true);
  };

  const handleCancelName = () => {
    setEditNameValue(profileData?.name || "");
    setIsEditingName(false);
  };

  const handleEditPhone = () => {
    setEditPhoneValue(profileData?.contact_number || "");
    setIsEditingPhone(true);
  };

  const handleCancelPhone = () => {
    setEditPhoneValue(profileData?.contact_number || "");
    setIsEditingPhone(false);
  };

  const handleGlobalSave = async () => {
    if (!profileData) return;

    try {
      const updateData: {
        name?: string;
        contact_number?: string;
        image?: File;
      } = {};

      // Only include changed fields
      if (editNameValue !== profileData.name) {
        if (editNameValue.length > 32) {
          toast.error("Name too long", {
            description: "Name must be 32 characters or less.",
          });
          return;
        }
        updateData.name = editNameValue;
      }

      if (editPhoneValue !== profileData.contact_number) {
        updateData.contact_number = editPhoneValue;
      }

      if (selectedImage) {
        updateData.image = selectedImage;
      }

      // Only call API if there are changes
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        return;
      }

      const result = await updateProfile(updateData).unwrap();

      // Update Redux auth state with the new user data
      dispatch(
        updateUser({
          name: result.name,
          image: result.image,
        }),
      );

      toast.success("Profile updated", {
        description: "Your profile has been updated successfully.",
      });

      setHasChanges(false);
      setIsEditingName(false);
      setIsEditingPhone(false);
      setSelectedImage(null);
      setImagePreview(null);

      // Refetch profile data
      refetch();
    } catch (error) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Please try again.";
      toast.error("Failed to update profile", {
        description: errorMessage,
      });
    }
  };

  const handleGlobalCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?",
      );
      if (!confirm) return;
    }

    // Reset all editing states
    setIsEditingName(false);
    setIsEditingPhone(false);
    setEditNameValue(profileData?.name || "");
    setEditPhoneValue(profileData?.contact_number || "");
    setSelectedImage(null);
    setImagePreview(null);
    setHasChanges(false);

    toast.info("Changes discarded", {
      description: "All unsaved changes have been discarded.",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Welcome {profileData?.name || "User"}!
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage your profile information here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleGlobalCancel}
            disabled={isUpdating}
            className="text-foreground border-gray-300 bg-transparent hover:bg-primary/30 hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGlobalSave}
            disabled={isUpdating || !hasChanges}
            className="bg-foreground text-white hover:bg-foreground"
          >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        {/* User Info Header */}
        <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 bg-gray-200 group">
            <Image
              src={imagePreview || getFullImageUrl(profileData?.image)}
              alt="Profile"
              fill
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profileData?.name || "User",
                )}&background=random&size=72`;
              }}
              unoptimized
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Upload className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {profileData?.name || "User"}
            </h2>
            <p className="text-xs sm:text-sm text-secondary">
              Update your username and manage your account
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12">
          {/* Section Navigation Tabs */}
          <div className="w-full md:w-48 shrink-0 space-y-3">
            <button
              onClick={() => setActiveSection("account")}
              className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all ${
                activeSection === "account"
                  ? "bg-green-50 text-primary border-l-4 border-primary"
                  : "text-secondary hover:bg-blue-50"
              }`}
            >
              Account Settings
            </button>
            {/* <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-semibold transition-all ${
                activeSection === "notifications"
                  ? "bg-green-50 text-primary border-l-4 border-primary"
                  : "text-secondary hover:bg-blue-50"
              }`}
            >
              Notifications
            </button> */}
          </div>

          {/* Form Fields */}
          <div className="flex-1 flex flex-col divide-y divide-gray-100">
            {/* Account Settings Section */}
            {activeSection === "account" && (
              <>
                {/* Name Field */}
                <div className="py-4 sm:py-6 first:pt-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Your name
                      </label>

                      {isEditingName ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-4 sm:p-6 rounded-lg">
                          <p className="text-sm text-secondary mb-3">
                            Make sure this match the name on your any Govt. ID.
                          </p>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Full name
                            </label>
                            <Input
                              value={editNameValue}
                              onChange={(e) => {
                                setEditNameValue(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full bg-white border-gray-300 text-foreground dark:text-gray-100"
                              placeholder="Enter your full name"
                              maxLength={32}
                            />
                            <div className="text-right text-xs text-gray-400">
                              text limit {editNameValue.length}/32
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelName}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {profileData?.name || "N/A"}
                        </div>
                      )}
                    </div>

                    {!isEditingName && (
                      <button
                        onClick={handleEditName}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="py-4 sm:py-6 border-b border-gray-100">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone Number
                      </label>

                      {isEditingPhone ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-4 sm:p-6 rounded-lg">
                          <div className="space-y-2">
                            <Input
                              value={editPhoneValue}
                              onChange={(e) => {
                                setEditPhoneValue(e.target.value);
                                setHasChanges(true);
                              }}
                              className="w-full bg-white border-gray-300 text-foreground"
                              placeholder="000-0000-000"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelPhone}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {profileData?.contact_number || "N/A"}
                        </div>
                      )}
                    </div>

                    {!isEditingPhone && (
                      <button
                        onClick={handleEditPhone}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Address Field */}
                {/* <div className="py-4 sm:py-6 border-b border-gray-100">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Address
                      </label>

                      {isEditingAddress ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-4 sm:p-6 rounded-lg">
                          <div className="space-y-2">
                            <Input
                              value={editAddressValue}
                              onChange={(e) =>
                                setEditAddressValue(e.target.value)
                              }
                              className="w-full bg-white border-gray-300 text-foreground"
                              placeholder="123 Admin Street, Dhaka"
                            />
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelAddress}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSaveAddress}
                              className="text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground mt-1">
                          {user.address}
                        </div>
                      )}
                    </div>

                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div> */}

                {/* Email Field */}
                {/* <div className="py-4 sm:py-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Email
                      </label>
                      <div className="text-foreground">
                        {showEmail
                          ? user.email
                          : user.email.replace(/(.{3})(.*)(@.*)/, "$1***$3")}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors"
                    >
                      {showEmail ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {showEmail ? "Hide" : "View"}
                    </button>
                  </div>
                </div> */}

                {/* Password Field */}
                {/* <div className="py-4 sm:py-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Password
                      </label>

                      {isEditingPassword ? (
                        <div className="mt-3 max-w-full bg-blue-50 text-foreground p-4 sm:p-6 rounded-lg space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Current password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.current}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  current: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter current password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              New password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.new}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  new: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Enter new password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-secondary">
                              Confirm new password
                            </label>
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.confirm}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirm: e.target.value,
                                })
                              }
                              className="w-full bg-white border-gray-300"
                              placeholder="Confirm new password"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="showPassword"
                              checked={showPassword}
                              onChange={(e) =>
                                setShowPassword(e.target.checked)
                              }
                              className="rounded"
                            />
                            <label
                              htmlFor="showPassword"
                              className="text-xs text-secondary"
                            >
                              Show passwords
                            </label>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelPassword}
                              className="bg-gray-100 text-foreground hover:bg-gray-200"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleChangePassword}
                              className="bg-foreground text-white hover:bg-foreground"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground text-xl leading-none tracking-widest mt-1">
                          ••••••••••••••••
                        </div>
                      )}
                    </div>

                    {!isEditingPassword && (
                      <button
                        onClick={() => setIsEditingPassword(true)}
                        className="flex items-center gap-2 text-secondary hover:text-foreground font-semibold text-sm transition-colors mt-1"
                      >
                        <Pencil className="w-4 h-4" /> Change
                      </button>
                    )}
                  </div>
                </div> */}
              </>
            )}

            {/* Notifications Section */}
            {/* {activeSection === "notifications" && (
              <div>
                <NotificationsClient />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
