import {
  parseAssignees,
  formatAssignees,
  validateAssigneeNames,
  MAX_DISPLAYED_ASSIGNEES,
  cn,
} from "../utils";

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", { conditional: true, hidden: false })).toBe("base conditional");
    });

    it("should handle empty strings", () => {
      expect(cn("", "class1", "")).toBe("class1");
    });
  });

  describe("parseAssignees", () => {
    it("should parse comma-separated assignee names", () => {
      expect(parseAssignees("John Doe, Jane Smith")).toEqual(["John Doe", "Jane Smith"]);
    });

    it("should handle single assignee", () => {
      expect(parseAssignees("John Doe")).toEqual(["John Doe"]);
    });

    it("should trim whitespace", () => {
      expect(parseAssignees("  John Doe  ,  Jane Smith  ")).toEqual(["John Doe", "Jane Smith"]);
    });

    it("should filter empty strings", () => {
      expect(parseAssignees("John Doe,, Jane Smith,")).toEqual(["John Doe", "Jane Smith"]);
    });

    it("should handle empty string", () => {
      expect(parseAssignees("")).toEqual([]);
    });

    it("should handle string with only commas", () => {
      expect(parseAssignees(",,,")).toEqual([]);
    });

    it("should handle whitespace-only strings", () => {
      expect(parseAssignees("   ,  ,  ")).toEqual([]);
    });
  });

  describe("formatAssignees", () => {
    it("should format array of assignees to comma-separated string", () => {
      expect(formatAssignees(["John Doe", "Jane Smith"])).toBe("John Doe, Jane Smith");
    });

    it("should handle single assignee", () => {
      expect(formatAssignees(["John Doe"])).toBe("John Doe");
    });

    it("should handle empty array", () => {
      expect(formatAssignees([])).toBe("");
    });

    it("should handle array with empty strings", () => {
      expect(formatAssignees(["John", "", "Smith"])).toBe("John, , Smith");
    });
  });

  describe("validateAssigneeNames", () => {
    it("should validate correct assignee names", () => {
      const result = validateAssigneeNames(["John Doe", "Jane-Smith", "O'Connor"]);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject names with invalid characters", () => {
      const result = validateAssigneeNames(["John123", "Jane@Smith", "Bob!"]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "Assignee names can only contain letters, spaces, hyphens, and apostrophes",
      );
    });

    it("should handle empty array", () => {
      const result = validateAssigneeNames([]);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should handle names with accented characters", () => {
      const result = validateAssigneeNames(["José García", "François"]);
      expect(result.isValid).toBe(true);
    });

    it("should reject names with numbers", () => {
      const result = validateAssigneeNames(["John123"]);
      expect(result.isValid).toBe(false);
    });

    it("should reject names with special characters", () => {
      const result = validateAssigneeNames(["John@Doe"]);
      expect(result.isValid).toBe(false);
    });

    it("should reject names with symbols", () => {
      const result = validateAssigneeNames(["John#Doe"]);
      expect(result.isValid).toBe(false);
    });

    it("should accept names with apostrophes", () => {
      const result = validateAssigneeNames(["O'Connor", "D'Angelo"]);
      expect(result.isValid).toBe(true);
    });

    it("should accept names with hyphens", () => {
      const result = validateAssigneeNames(["Jean-Pierre", "Mary-Jane"]);
      expect(result.isValid).toBe(true);
    });
  });

  describe("MAX_DISPLAYED_ASSIGNEES", () => {
    it("should be a number", () => {
      expect(typeof MAX_DISPLAYED_ASSIGNEES).toBe("number");
    });

    it("should be greater than 0", () => {
      expect(MAX_DISPLAYED_ASSIGNEES).toBeGreaterThan(0);
    });

    it("should be 3", () => {
      expect(MAX_DISPLAYED_ASSIGNEES).toBe(3);
    });
  });
});
