export interface AvatarData {
  imageUrl?: string;
  initials: string;
  color: string;
}

export class AvatarService {
  private static readonly AVATAR_API_BASE = "https://api.dicebear.com/7.x/personas/svg";
  private static readonly FALLBACK_COLORS = [
    "!bg-blue-100 !text-blue-800 dark:!bg-blue-900/20 dark:!text-blue-400",
    "!bg-green-100 !text-green-800 dark:!bg-green-900/20 dark:!text-green-400",
    "!bg-purple-100 !text-purple-800 dark:!bg-purple-900/20 dark:!text-purple-400",
    "!bg-pink-100 !text-pink-800 dark:!bg-pink-900/20 dark:!text-pink-400",
    "!bg-indigo-100 !text-indigo-800 dark:!bg-indigo-900/20 dark:!text-indigo-400",
    "!bg-yellow-100 !text-yellow-800 dark:!bg-yellow-900/20 dark:!text-yellow-400",
    "!bg-red-100 !text-red-800 dark:!bg-red-900/20 dark:!text-red-400",
    "!bg-teal-100 !text-teal-800 dark:!bg-teal-900/20 dark:!text-teal-400",
  ];

  /**
   * Get avatar data for a given assignee name
   * @param assigneeName - The name of the assignee
   * @returns Promise<AvatarData> - Avatar data including image URL, initials, and color
   */
  static async getAvatarData(assigneeName: string): Promise<AvatarData> {
    if (!assigneeName?.trim()) {
      return {
        initials: "?",
        color: this.FALLBACK_COLORS[0],
      };
    }

    const initials = this.getInitials(assigneeName);
    const colorIndex = this.getColorIndex(assigneeName);
    const color = this.FALLBACK_COLORS[colorIndex];

    try {
      const imageUrl = await this.generateAvatarUrl(assigneeName, initials);
      return {
        imageUrl,
        initials,
        color,
      };
    } catch (error) {
      console.warn("Failed to generate avatar image, using fallback:", error);
      return {
        initials,
        color,
      };
    }
  }

  /**
   * Generate initials from a name
   * @param name - The full name
   * @returns string - Up to 2 uppercase initials
   */
  private static getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Get a consistent color index based on the name
   * @param name - The name to generate a color for
   * @returns number - Index for the color array
   */
  private static getColorIndex(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % this.FALLBACK_COLORS.length;
  }

  /**
   * Generate an avatar URL from an external service
   * @param name - The full name
   * @param initials - The initials to display
   * @returns Promise<string> - The avatar image URL
   */
  private static async generateAvatarUrl(name: string, initials: string): Promise<string> {
    const params = new URLSearchParams({
      seed: name.toLowerCase().replace(/\s+/g, "-"),
      backgroundColor: "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      textColor: "000000",
      size: "40",
    });

    return `${this.AVATAR_API_BASE}?${params.toString()}`;
  }

  /**
   * Preload avatar images for better performance
   * @param assigneeNames - Array of assignee names to preload
   */
  static async preloadAvatars(assigneeNames: string[]): Promise<void> {
    const uniqueNames = [...new Set(assigneeNames.filter(Boolean))];

    await Promise.allSettled(
      uniqueNames.map(async (name) => {
        try {
          const avatarData = await this.getAvatarData(name);
          if (avatarData.imageUrl) {
            const img = new Image();
            img.src = avatarData.imageUrl;
          }
        } catch (error) {
          console.warn(`Failed to preload avatar for ${name}:`, error);
        }
      }),
    );
  }
}
