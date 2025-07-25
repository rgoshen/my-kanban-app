import { AvatarService } from "../avatar-service";

// Mock fetch for consistent testing
global.fetch = jest.fn();

describe("AvatarService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvatarData", () => {
    it("should return fallback data for empty assignee name", async () => {
      const result = await AvatarService.getAvatarData("");
      expect(result).toEqual({
        initials: "?",
        color: "!bg-blue-100 !text-blue-800 dark:!bg-blue-900/20 dark:!text-blue-400",
      });
    });

    it("should return fallback data for whitespace-only name", async () => {
      const result = await AvatarService.getAvatarData("   ");
      expect(result).toEqual({
        initials: "?",
        color: "!bg-blue-100 !text-blue-800 dark:!bg-blue-900/20 dark:!text-blue-400",
      });
    });

    it("should generate avatar data for valid name", async () => {
      const result = await AvatarService.getAvatarData("John Doe");

      expect(result.initials).toBe("JD");
      expect(result.color).toMatch(
        /!bg-\w+-100 !text-\w+-800 dark:!bg-\w+-900\/20 dark:!text-\w+-400/,
      );
      expect(result.imageUrl).toContain("api.dicebear.com/7.x/personas/png");
    });

    it("should handle API errors gracefully", async () => {
      // Mock the generateAvatarUrl to throw an error
      const originalGenerateAvatarUrl = (AvatarService as any).generateAvatarUrl;
      (AvatarService as any).generateAvatarUrl = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      const result = await AvatarService.getAvatarData("John Doe");

      expect(result.initials).toBe("JD");
      expect(result.color).toMatch(
        /!bg-\w+-100 !text-\w+-800 dark:!bg-\w+-900\/20 dark:!text-\w+-400/,
      );
      expect(result.imageUrl).toBeUndefined();

      // Restore original method
      (AvatarService as any).generateAvatarUrl = originalGenerateAvatarUrl;
    });

    it("should generate correct initials for single name", async () => {
      const result = await AvatarService.getAvatarData("John");
      expect(result.initials).toBe("J");
    });

    it("should generate correct initials for multiple names", async () => {
      const result = await AvatarService.getAvatarData("John Michael Doe");
      expect(result.initials).toBe("JM");
    });

    it("should handle names with special characters", async () => {
      const result = await AvatarService.getAvatarData("José García");
      expect(result.initials).toBe("JG");
    });

    it("should generate consistent colors for the same name", async () => {
      const result1 = await AvatarService.getAvatarData("John Doe");
      const result2 = await AvatarService.getAvatarData("John Doe");
      expect(result1.color).toBe(result2.color);
    });

    it("should generate different colors for different names", async () => {
      const result1 = await AvatarService.getAvatarData("John Doe");
      const result2 = await AvatarService.getAvatarData("Jane Smith");
      expect(result1.color).not.toBe(result2.color);
    });
  });

  describe("preloadAvatars", () => {
    it("should preload avatars for multiple names", async () => {
      // Mock the Image constructor
      const mockImage = jest.fn().mockImplementation(() => ({
        src: "",
      }));
      global.Image = mockImage as any;

      await AvatarService.preloadAvatars(["John Doe", "Jane Smith"]);

      // Should create Image instances for each name
      expect(mockImage).toHaveBeenCalledTimes(2);
    });

    it("should handle duplicate names", async () => {
      const mockImage = jest.fn().mockImplementation(() => ({
        src: "",
      }));
      global.Image = mockImage as any;

      await AvatarService.preloadAvatars(["John Doe", "John Doe", "Jane Smith"]);

      // Should only create Image instances for unique names
      expect(mockImage).toHaveBeenCalledTimes(2);
    });

    it("should filter out empty names", async () => {
      const mockImage = jest.fn().mockImplementation(() => ({
        src: "",
      }));
      global.Image = mockImage as any;

      await AvatarService.preloadAvatars(["John Doe", "", "Jane Smith", "   "]);

      // Should only create Image instances for non-empty names
      expect(mockImage).toHaveBeenCalledTimes(2);
    });

    it("should handle errors in preload gracefully", async () => {
      // Mock getAvatarData to throw an error
      const originalGetAvatarData = AvatarService.getAvatarData;
      AvatarService.getAvatarData = jest.fn().mockRejectedValue(new Error("Test error"));

      await expect(AvatarService.preloadAvatars(["John Doe"])).resolves.not.toThrow();

      // Restore original method
      AvatarService.getAvatarData = originalGetAvatarData;
    });
  });
});
