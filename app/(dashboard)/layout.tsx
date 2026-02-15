/** @format */

// app/dashboard/layout.tsx

import DashboardWrapper from "@/components/Sidebar/Sidebar";
import ProfileDataSync from "@/components/Common/ProfileDataSync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardWrapper>
      <ProfileDataSync />
      {children}
    </DashboardWrapper>
  );
}
