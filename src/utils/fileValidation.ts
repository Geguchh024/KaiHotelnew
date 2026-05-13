const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

/**
 * Validates an image file for upload.
 * Returns null if valid, or an error message string if invalid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_SIZE_BYTES) {
    return 'File must be JPEG, PNG, or WebP and under 10 MB'
  }
  return null
}
