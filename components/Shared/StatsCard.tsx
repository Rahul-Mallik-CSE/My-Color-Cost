/** @format */

// components/Dashboard/Shared/StatsCard.tsx
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { StatsCardProps } from "@/types/stats";

export function StatsCard({
  title,
  value,
  icon: Icon,
  imageIcon,
  iconColor,
  iconBgColor,
  isUp = true,
  subtitle,
  percentage,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white px-4 py-4 sm:px-6 sm:py-6 rounded-xl flex items-start justify-between h-full border border-none cursor-pointer transition-all hover:bg-blue-50 shadow-[6px_6px_54px_0px_#0000000D]",
        className,
      )}
    >
      <div className="flex flex-col justify-between h-full gap-4">
        <div>
          <h3 className="text-gray-500 text-sm sm:text-base font-medium font-nunito mb-2">
            {title}
          </h3>
          <div className="text-2xl sm:text-3xl font-bold text-foreground font-nunito">
            {value}
          </div>
        </div>

        
      </div>

      {/* Dynamic Icon Rendering */}
      <div
        className="flex items-center justify-center rounded-[24px] p-3 2xl:p-4"
        style={{ backgroundColor: iconBgColor }}
      >
        {imageIcon ? (
          // Render image icon
          <Image
            src={imageIcon}
            alt={title}
            width={32}
            height={32}
            className="object-contain w-4 h-4  2xl:w-6 2xl:h-6"
          />
        ) : Icon ? (
          // Render Lucide or React Icon
          <Icon
            className="w-4 h-4  2xl:w-6 2xl:h-6"
            style={{ color: iconColor }}
            strokeWidth={2}
          />
        ) : null}
      </div>
    </div>
  );
}
