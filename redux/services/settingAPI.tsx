/** @format */

// redux/services/settingAPI.tsx
import { apiSlice } from "./apiSlice";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  image: string | null;
  contact_number: string;
  role: string;
  staff_limit: number;
  notification_enabled: boolean;
  verified: boolean;
  sub_users_count: number;
  can_create_staff: boolean;
  created_at: string;
}

export const settingAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/me/",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<
      UserProfile,
      { name?: string; contact_number?: string; image?: File }
    >({
      query: (data) => {
        const formData = new FormData();

        if (data.name) {
          formData.append("name", data.name);
        }

        if (data.contact_number) {
          formData.append("contact_number", data.contact_number);
        }

        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: "/auth/profile/update/",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = settingAPI;
