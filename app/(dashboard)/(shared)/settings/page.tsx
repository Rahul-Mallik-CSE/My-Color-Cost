/** @format */

import ProfileClient from "@/components/Common/Profile/ProfileClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader
        title="Settings"
        description="View and manage your settings"
      />
      <div className="p-4 md:p-8">
        <ProfileClient />
      </div>
    </div>
  );
}
