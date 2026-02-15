/** @format */

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { updateUser } from "@/redux/features/authSlice";
import { useGetProfileQuery } from "@/redux/services/settingAPI";

/**
 * Component that syncs profile data from API with Redux auth state
 * This ensures user image and other profile data is available app-wide
 */
export default function ProfileDataSync() {
  const dispatch = useAppDispatch();
  const { data: profileData } = useGetProfileQuery();

  useEffect(() => {
    if (profileData) {
      console.log("🔄 ProfileDataSync: Syncing profile data to Redux:", {
        name: profileData.name,
        email: profileData.email,
        image: profileData.image,
      });

      dispatch(
        updateUser({
          name: profileData.name,
          email: profileData.email,
          image: profileData.image,
        }),
      );
    }
  }, [profileData, dispatch]);

  // This component doesn't render anything
  return null;
}
