/** @format */

import ProfileClient from "@/components/Common/Profile/ProfileClient";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <DashboardHeader
        title="Settings"
        description="View and manage your settings"
      />
      <div className="p-4 md:p-8">
        {/* Terms and Conditions Button */}
        <div className="mb-6">
          <Link href="/settings/terms-and-conditions">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms and Conditions
            </Button>
          </Link>
        </div>

        <ProfileClient />
      </div>
    </div>
  );
}
