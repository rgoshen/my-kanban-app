import DOMPurify from "isomorphic-dompurify";

/**
 * Validate if a string is a valid UUID format
 * @param id - The string to validate
 * @returns boolean - True if valid UUID format
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Sanitize a string to prevent XSS and injection attacks
 * @param input - The string to sanitize
 * @returns string - Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return "";

  // Use DOMPurify to remove any HTML/script tags and dangerous content
  // KEEP_CONTENT ensures text content is preserved while removing tags
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Validate and sanitize a required string field
 * @param input - The string to validate and sanitize
 * @param fieldName - Name of the field for error messages
 * @returns string - Sanitized string
 * @throws Error if input is empty or invalid
 */
export function validateRequiredString(input: string | undefined, fieldName: string): string {
  if (!input || input.trim().length === 0) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }

  const sanitized = sanitizeString(input);
  if (sanitized.length === 0) {
    throw new Error(`${fieldName} contains only invalid characters`);
  }

  return sanitized;
}

/**
 * Validate and sanitize an optional string field
 * @param input - The string to validate and sanitize
 * @returns string | undefined - Sanitized string or undefined if input was empty
 */
export function validateOptionalString(input: string | null | undefined): string | undefined {
  if (!input || input.trim().length === 0) {
    return undefined;
  }

  const sanitized = sanitizeString(input);
  return sanitized.length > 0 ? sanitized : undefined;
}
