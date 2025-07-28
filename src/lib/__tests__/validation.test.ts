import {
  validateUUID,
  sanitizeString,
  validateRequiredString,
  validateOptionalString,
} from "../validation";

describe("Validation Module", () => {
  describe("validateUUID", () => {
    it("should validate correct UUID format", () => {
      const validUUIDs = [
        "123e4567-e89b-12d3-a456-426614174000",
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
        "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
      ];

      validUUIDs.forEach((uuid) => {
        expect(validateUUID(uuid)).toBe(true);
      });
    });

    it("should reject invalid UUID format", () => {
      const invalidUUIDs = [
        "not-a-uuid",
        "123e4567-e89b-12d3-a456-42661417400", // too short
        "123e4567-e89b-12d3-a456-4266141740000", // too long
        "123e4567-e89b-12d3-a456-42661417400g", // invalid character
        "123e4567-e89b-12d3-a456-42661417400", // missing character
        "",
        null,
        undefined,
      ];

      invalidUUIDs.forEach((uuid) => {
        expect(validateUUID(uuid as string)).toBe(false);
      });
    });
  });

  describe("sanitizeString", () => {
    it("should return empty string for falsy inputs", () => {
      expect(sanitizeString("")).toBe("");
      expect(sanitizeString(null as any)).toBe("");
      expect(sanitizeString(undefined as any)).toBe("");
    });

    it("should trim whitespace", () => {
      expect(sanitizeString("  hello world  ")).toBe("hello world");
    });

    it("should remove HTML tags", () => {
      // DOMPurify removes script content for security
      expect(sanitizeString("<script>alert('xss')</script>")).toBe("");
      expect(sanitizeString("<div>Hello</div>")).toBe("Hello");
      expect(sanitizeString("<p>Text with <strong>bold</strong> content</p>")).toBe(
        "Text with bold content",
      );
    });

    it("should remove dangerous attributes", () => {
      expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe("");
      expect(sanitizeString('<a href="javascript:alert(1)">Click me</a>')).toBe("Click me");
    });

    it("should preserve safe content", () => {
      expect(sanitizeString("Hello, World!")).toBe("Hello, World!");
      expect(sanitizeString("123-456-7890")).toBe("123-456-7890");
      expect(sanitizeString("user@example.com")).toBe("user@example.com");
    });

    it("should handle special characters", () => {
      expect(sanitizeString("Café & Résumé")).toBe("Café & Résumé");
      expect(sanitizeString("测试文本")).toBe("测试文本");
    });
  });

  describe("validateRequiredString", () => {
    it("should validate and sanitize valid strings", () => {
      expect(validateRequiredString("hello", "test")).toBe("hello");
      expect(validateRequiredString("  hello world  ", "test")).toBe("hello world");
    });

    it("should throw error for empty strings", () => {
      expect(() => validateRequiredString("", "field")).toThrow(
        "field is required and cannot be empty",
      );
      expect(() => validateRequiredString("   ", "field")).toThrow(
        "field is required and cannot be empty",
      );
    });

    it("should throw error for falsy values", () => {
      expect(() => validateRequiredString(null as any, "field")).toThrow(
        "field is required and cannot be empty",
      );
      expect(() => validateRequiredString(undefined as any, "field")).toThrow(
        "field is required and cannot be empty",
      );
    });

    it("should throw error for strings with only HTML tags", () => {
      // Empty tags result in empty content after sanitization
      expect(() => validateRequiredString("<script></script>", "field")).toThrow(
        "field contains only invalid characters",
      );
      expect(() => validateRequiredString("<div></div>", "field")).toThrow(
        "field contains only invalid characters",
      );
    });

    it("should sanitize HTML content", () => {
      // Script content is removed for security
      expect(() => validateRequiredString("<script>alert('xss')</script>", "field")).toThrow(
        "field contains only invalid characters",
      );
      expect(validateRequiredString("<div>Hello</div>", "field")).toBe("Hello");
    });
  });

  describe("validateOptionalString", () => {
    it("should return undefined for empty strings", () => {
      expect(validateOptionalString("")).toBeUndefined();
      expect(validateOptionalString("   ")).toBeUndefined();
      expect(validateOptionalString(null)).toBeUndefined();
      expect(validateOptionalString(undefined)).toBeUndefined();
    });

    it("should validate and sanitize valid strings", () => {
      expect(validateOptionalString("hello")).toBe("hello");
      expect(validateOptionalString("  hello world  ")).toBe("hello world");
    });

    it("should return undefined for strings with only HTML tags", () => {
      // Empty tags result in empty content after sanitization
      expect(validateOptionalString("<script></script>")).toBeUndefined();
      expect(validateOptionalString("<div></div>")).toBeUndefined();
    });

    it("should sanitize HTML content", () => {
      // Script content is removed for security
      expect(validateOptionalString("<script>alert('xss')</script>")).toBeUndefined();
      expect(validateOptionalString("<div>Hello</div>")).toBe("Hello");
    });

    it("should handle mixed content", () => {
      // DOMPurify removes script content for security
      expect(validateOptionalString("Hello <script>alert('xss')</script> World")).toBe(
        "Hello  World",
      );
    });
  });
});
