/** @format */

import { Suspense } from "react";
import ProfileSetupForm from "@/components/Auth/ProfileSetupForm";

const ProfileSetupPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileSetupForm />
    </Suspense>
  );
};

export default ProfileSetupPage;
