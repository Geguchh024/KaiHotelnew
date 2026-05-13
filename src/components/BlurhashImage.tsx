import { useState, useRef, useEffect, useCallback } from 'react'
import { decode } from 'blurhash'

interface BlurhashImageProps {
  src: string
  alt: string
  blurhash?: string | null
  className?: string
}

/**
 * Renders an image with a BlurHash placeholder that shows while the
 * full image is loading. Once the image loads, it fades in over the blur.
 */
export function BlurhashImage({ src, alt, blurhash, className = '' }: BlurhashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // If the image is already cached, onLoad won't fire — check on mount.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [src])

  // Decode and paint the blurhash onto a small canvas.
  useEffect(() => {
    if (!blurhash || !canvasRef.current) return

    try {
      const width = 32
      const height = 32
      const pixels = decode(blurhash, width, height)
      const canvas = canvasRef.current
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const imageData = ctx.createImageData(width, height)
      imageData.data.set(pixels)
      ctx.putImageData(imageData, 0, 0)
    } catch {
      // If decode fails, the image will load normally.
    }
  }, [blurhash])

  const handleLoad = useCallback(() => setIsLoaded(true), [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* BlurHash canvas placeholder — hidden once image is loaded */}
      {blurhash && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-hidden="true"
        />
      )}

      {/* Actual image — always rendered, fades in on load */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
      />
    </div>
  )
}
