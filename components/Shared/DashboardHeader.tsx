/** @format */

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import SearchBar from "./SearchBar";

export default function DashboardHeader({
  title,
  description,
  onSearch,
}: {
  title: string;
  description?: string;
  onSearch?: (value: string) => void;
}) {
  return (
    <div className="bg-white flex flex-col md:flex-row justify-between items-center py-4 px-4 md:px-8 border-b border-border gap-4">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground font-zilla">
          {title}
        </h1>
        {description && <p className="text-secondary mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-border">
            <Image
              src="/images/avatar.png"
              alt="Moni Roy"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="hidden md:flex flex-col">
            <p className="text-sm font-bold text-foreground font-nunito">
              Moni Roy
            </p>
            <p className="text-xs text-gray-500 font-bold">Admin</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
