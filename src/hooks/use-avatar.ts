import { useState, useEffect, useCallback } from "react";
import { AvatarService, AvatarData } from "@/lib/avatar-service";

interface UseAvatarOptions {
  enablePreloading?: boolean;
  cacheTimeout?: number; // in milliseconds
}

interface AvatarCache {
  [key: string]: {
    data: AvatarData;
    timestamp: number;
  };
}

// Global cache to persist across component re-renders
const avatarCache: AvatarCache = {};

export function useAvatar(assigneeName: string | undefined, options: UseAvatarOptions = {}) {
  const { enablePreloading = true, cacheTimeout = 5 * 60 * 1000 } = options; // 5 minutes default
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedAvatar = useCallback(
    (name: string): AvatarData | null => {
      const cached = avatarCache[name];
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.data;
      }
      return null;
    },
    [cacheTimeout],
  );

  const setCachedAvatar = useCallback((name: string, data: AvatarData) => {
    avatarCache[name] = {
      data,
      timestamp: Date.now(),
    };
  }, []);

  const fetchAvatarData = useCallback(
    async (name: string) => {
      // Check cache first
      const cached = getCachedAvatar(name);
      if (cached) {
        setAvatarData(cached);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await AvatarService.getAvatarData(name);
        setAvatarData(data);
        setCachedAvatar(name, data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load avatar";
        setError(errorMessage);
        console.error("Avatar fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [getCachedAvatar, setCachedAvatar],
  );

  // Fetch avatar data when assignee name changes
  useEffect(() => {
    if (!assigneeName?.trim()) {
      setAvatarData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    fetchAvatarData(assigneeName);
  }, [assigneeName, fetchAvatarData]);

  // Preload avatars if enabled
  useEffect(() => {
    if (enablePreloading && assigneeName?.trim()) {
      AvatarService.preloadAvatars([assigneeName]).catch((err) => {
        console.warn("Failed to preload avatar:", err);
      });
    }
  }, [assigneeName, enablePreloading]);

  const refreshAvatar = useCallback(() => {
    if (assigneeName?.trim()) {
      // Remove from cache to force refresh
      delete avatarCache[assigneeName];
      fetchAvatarData(assigneeName);
    }
  }, [assigneeName, fetchAvatarData]);

  return {
    avatarData,
    isLoading,
    error,
    refreshAvatar,
  };
}

// Hook for preloading multiple avatars
export function useAvatarPreloader(assigneeNames: string[]) {
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadAvatars = useCallback(async () => {
    if (assigneeNames.length === 0) return;

    setIsPreloading(true);
    try {
      await AvatarService.preloadAvatars(assigneeNames);
    } catch (error) {
      console.warn("Failed to preload avatars:", error);
    } finally {
      setIsPreloading(false);
    }
  }, [assigneeNames]);

  useEffect(() => {
    preloadAvatars();
  }, [preloadAvatars]);

  return { isPreloading };
}
