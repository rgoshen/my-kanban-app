import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse comma-separated assignee names into an array
 * @param assigneesString - Comma-separated string of assignee names
 * @returns Array of trimmed, non-empty assignee names
 */
export function parseAssignees(assigneesString: string): string[] {
  return assigneesString
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/**
 * Format array of assignee names into a comma-separated string
 * @param assignees - Array of assignee names
 * @returns Comma-separated string of assignee names
 */
export function formatAssignees(assignees: string[]): string {
  return assignees.join(", ");
}

/**
 * Validate assignee names according to the application's rules
 * @param names - Array of assignee names to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateAssigneeNames(names: string[]): { isValid: boolean; error?: string } {
  if (names.length === 0) {
    return { isValid: true }; // Allow empty arrays for unassigned tasks
  }

  // Check for valid characters: letters, spaces, hyphens, apostrophes, and accented characters
  const nameRegex = /^[\p{L}\s'-]+$/u;

  for (const name of names) {
    if (!nameRegex.test(name)) {
      return {
        isValid: false,
        error: "Assignee names can only contain letters, spaces, hyphens, and apostrophes",
      };
    }
  }

  return { isValid: true };
}
