import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { decode } from 'blurhash'

interface BlurhashImageProps {
  src: string
  alt: string
  blurhash?: string | null
  className?: string
  /** Mark as high-priority (above the fold). Disables lazy loading. */
  priority?: boolean
  /** Responsive sizes attribute for the browser to pick the right source */
  sizes?: string
}

// In-memory cache for decoded blurhash data URLs to avoid re-decoding
const blurhashCache = new Map<string, string>()

function decodeBlurhashToDataUrl(hash: string): string | null {
  if (blurhashCache.has(hash)) return blurhashCache.get(hash)!

  try {
    const width = 32
    const height = 32
    const pixels = decode(hash, width, height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)

    const dataUrl = canvas.toDataURL()
    blurhashCache.set(hash, dataUrl)
    return dataUrl
  } catch {
    return null
  }
}

/**
 * Renders an image with a BlurHash placeholder that shows while the
 * full image is loading. Once the image loads, it fades in over the blur.
 *
 * Optimizations:
 * - Native lazy loading for off-screen images (disabled with `priority`)
 * - `decoding="async"` to avoid blocking the main thread
 * - `fetchpriority` hint for above-the-fold images
 * - Blurhash decode results are cached in memory
 * - Memoized to prevent unnecessary re-renders
 */
export const BlurhashImage = memo(function BlurhashImage({
  src,
  alt,
  blurhash,
  className = '',
  priority = false,
  sizes,
}: BlurhashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const blurhashDataUrl = blurhash ? decodeBlurhashToDataUrl(blurhash) : null

  // If the image is already cached by the browser, mark as loaded immediately.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [src])

  const handleLoad = useCallback(() => setIsLoaded(true), [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* BlurHash placeholder as a background — no extra canvas element needed */}
      {blurhashDataUrl && !isLoaded && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${blurhashDataUrl})` }}
          aria-hidden="true"
        />
      )}

      {/* Actual image — always rendered, fades in on load */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
      />
    </div>
  )
})
