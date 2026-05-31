import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { decode } from 'blurhash'

interface BlurhashImageProps {
  src: string
  alt: string
  blurhash?: string | null
  className?: string
  /** Mark as high-priority (above the fold). Disables lazy loading. */
  priority?: boolean
  /** Responsive sizes attribute for the browser to pick the right source. */
  sizes?: string
  /** How the full image fits its frame. Defaults to cover for cards and heroes. */
  objectFit?: 'cover' | 'contain'
}

// Keep decoded placeholders and image state across repeated cards and navigation.
const blurhashCache = new Map<string, string>()
const decodedImageCache = new Set<string>()

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
 * Renders a BlurHash immediately, then cross-fades to the full image only
 * after its pixels have decoded. The overlap prevents a blank frame between
 * the placeholder and the final image on slower connections.
 */
export const BlurhashImage = memo(function BlurhashImage({
  src,
  alt,
  blurhash,
  className = '',
  priority = false,
  sizes,
  objectFit = 'cover',
}: BlurhashImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(() =>
    decodedImageCache.has(src) ? src : null,
  )
  const [placeholder, setPlaceholder] = useState<{
    hash: string
    dataUrl: string
  } | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const currentSrcRef = useRef(src)

  const isLoaded = loadedSrc === src
  const blurhashDataUrl =
    placeholder && placeholder.hash === blurhash ? placeholder.dataUrl : null

  const revealDecodedImage = useCallback(
    async (image: HTMLImageElement, expectedSrc: string) => {
      try {
        await image.decode()
      } catch {
        // Cached images can reject decode() even when their pixels are ready.
      }

      if (currentSrcRef.current !== expectedSrc || image.naturalWidth === 0) {
        return
      }

      decodedImageCache.add(expectedSrc)
      setLoadedSrc(expectedSrc)
    },
    [],
  )

  useEffect(() => {
    currentSrcRef.current = src
    setLoadedSrc(decodedImageCache.has(src) ? src : null)

    if (blurhash) {
      const dataUrl = decodeBlurhashToDataUrl(blurhash)
      setPlaceholder(dataUrl ? { hash: blurhash, dataUrl } : null)
    } else {
      setPlaceholder(null)
    }

    const image = imgRef.current
    if (image?.complete && image.naturalWidth > 0) {
      void revealDecodedImage(image, src)
    }
  }, [blurhash, revealDecodedImage, src])

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      void revealDecodedImage(event.currentTarget, currentSrcRef.current)
    },
    [revealDecodedImage],
  )

  return (
    <div
      className={`blurhash-image relative overflow-hidden bg-surface-container ${className}`}
      aria-busy={!isLoaded}
    >
      {blurhashDataUrl && (
        <div
          className={`blurhash-image__placeholder absolute inset-0 w-full h-full bg-cover bg-center ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url(${blurhashDataUrl})` }}
          aria-hidden="true"
        />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        className={`blurhash-image__asset relative block w-full h-full ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
      />
    </div>
  )
})
