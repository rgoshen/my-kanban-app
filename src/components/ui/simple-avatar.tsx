"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarService } from "@/lib/avatar-service";
import { cn } from "@/lib/utils";

interface SimpleAvatarProps {
  assigneeName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

const fallbackSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function SimpleAvatar({ assigneeName, size = "md", className }: SimpleAvatarProps) {
  const [avatarData, setAvatarData] = React.useState<{
    imageUrl?: string;
    initials: string;
    color: string;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!assigneeName?.trim()) {
      setAvatarData({
        initials: "?",
        color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      });
      setIsLoading(false);
      return;
    }

    const loadAvatar = async () => {
      try {
        const data = await AvatarService.getAvatarData(assigneeName);
        setAvatarData(data);
      } catch (error) {
        console.error("Failed to load avatar:", error);
        // Fallback to basic initials
        const initials = assigneeName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        setAvatarData({
          initials,
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAvatar();
  }, [assigneeName]);

  if (!assigneeName?.trim()) {
    return (
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarFallback
          className={cn(
            "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            fallbackSizeClasses[size],
          )}
        >
          ?
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {avatarData?.imageUrl && !isLoading ? (
        <img
          src={avatarData.imageUrl}
          alt={`Avatar for ${assigneeName}`}
          className="w-full h-full rounded-full object-cover"
          onLoad={() => {
            console.log(`✅ Avatar image loaded successfully for ${assigneeName}`);
          }}
          onError={(e) => {
            console.warn(`❌ Failed to load avatar image for ${assigneeName}:`, e);
          }}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center",
            avatarData?.color || "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
            fallbackSizeClasses[size],
          )}
        >
          {isLoading ? (
            <div className="animate-pulse bg-current opacity-50 rounded-full w-3 h-3" />
          ) : (
            avatarData?.initials || "?"
          )}
        </div>
      )}
    </div>
  );
}
