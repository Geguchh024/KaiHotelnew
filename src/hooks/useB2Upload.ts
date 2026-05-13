import { useState } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { encode } from 'blurhash'

interface UploadResult {
  publicUrl: string
  blurhash: string | null
}

interface UseB2UploadReturn {
  upload: (file: File) => Promise<UploadResult | null>
  isUploading: boolean
  error: string | null
}

/**
 * Generates a BlurHash string from an image File using an offscreen canvas.
 * Runs entirely in the browser — no native binaries needed.
 */
async function generateBlurhash(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      try {
        const size = 32
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        ctx.drawImage(img, 0, 0, size, size)
        const imageData = ctx.getImageData(0, 0, size, size)
        const hash = encode(imageData.data as unknown as Uint8ClampedArray, size, size, 4, 3)
        resolve(hash)
      } catch {
        resolve(null)
      } finally {
        URL.revokeObjectURL(url)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }

    img.src = url
  })
}

export function useB2Upload(): UseB2UploadReturn {
  const { sessionToken } = useAdminAuth()
  const uploadFile = useAction(api.b2.uploadFile)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<UploadResult | null> => {
    if (!sessionToken) {
      setError('Image upload failed. Please try again.')
      return null
    }

    setError(null)
    setIsUploading(true)

    try {
      // Generate blurhash client-side before uploading.
      const blurhash = await generateBlurhash(file)

      // Convert file to base64 and upload through Convex action (no CORS issues).
      const arrayBuffer = await file.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      )

      const result = await uploadFile({
        sessionToken,
        fileName: file.name,
        contentType: file.type,
        fileData: base64,
        blurhash: blurhash ?? undefined,
      })

      return {
        publicUrl: result.publicUrl,
        blurhash: result.blurhash,
      }
    } catch (err) {
      console.error('B2 upload error:', err)
      setError('Image upload failed. Please try again.')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error }
}
