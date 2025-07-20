import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAvatar } from "@/hooks/use-avatar";
import { cn } from "@/lib/utils";

interface EnhancedAvatarProps {
  assigneeName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLoadingState?: boolean;
  onError?: (error: string) => void;
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

export function EnhancedAvatar({
  assigneeName,
  size = "md",
  className,
  showLoadingState = true,
  onError,
}: EnhancedAvatarProps) {
  const { avatarData, isLoading, error } = useAvatar(assigneeName);

  // Handle error callback
  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

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
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarData?.imageUrl && (
        <AvatarImage
          src={avatarData.imageUrl}
          alt={`Avatar for ${assigneeName}`}
          onError={(e) => {
            console.warn(`Failed to load avatar image for ${assigneeName}:`, e);
            // Fallback to initials will be handled by AvatarFallback
          }}
        />
      )}
      <AvatarFallback
        className={cn(
          avatarData?.color || "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          fallbackSizeClasses[size],
        )}
      >
        {isLoading && showLoadingState ? (
          <div className="animate-pulse bg-current opacity-50 rounded-full w-3 h-3" />
        ) : (
          avatarData?.initials || "?"
        )}
      </AvatarFallback>
    </Avatar>
  );
}

// Export a simpler version for backward compatibility
export function SimpleAvatar({
  assigneeName,
  size = "md",
  className,
}: Omit<EnhancedAvatarProps, "showLoadingState" | "onError">) {
  return (
    <EnhancedAvatar
      assigneeName={assigneeName}
      size={size}
      className={className}
      showLoadingState={false}
    />
  );
}
