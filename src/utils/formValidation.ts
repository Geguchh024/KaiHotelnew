/**
 * Validates that a value is not empty or whitespace-only.
 * Returns an error string if invalid, null if valid.
 */
export function validateRequired(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'This field is required'
  }
  return null
}

/**
 * Validates that a value is a valid URL.
 * Returns an error string if invalid, null if valid.
 */
export function validateUrl(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'This field is required'
  }
  try {
    new URL(value)
    return null
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)'
  }
}
