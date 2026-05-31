import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useB2Upload } from '@/hooks/useB2Upload'
import { validateImageFile } from '@/utils/fileValidation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'

interface ImageUploadDialogProps {
  isOpen: boolean
  onClose: () => void
}

type FileStatus = 'pending' | 'uploading' | 'done' | 'error'

interface FileEntry {
  id: string
  file: File
  previewUrl: string
  altText: string
  status: FileStatus
  errorMsg?: string
}

export function ImageUploadDialog({ isOpen, onClose }: ImageUploadDialogProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const { upload } = useB2Upload()
  const createGalleryImage = useMutation(api.gallery.create)
  const existingImages = useQuery(api.gallery.list) ?? []

  const [entries, setEntries] = useState<FileEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setEntries((prev) => {
        prev.forEach((e) => URL.revokeObjectURL(e.previewUrl))
        return []
      })
      setIsRunning(false)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !isRunning) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, isRunning, onClose])

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    const valid: FileEntry[] = []
    arr.forEach((file) => {
      if (validateImageFile(file)) return // skip invalid
      valid.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        altText: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        status: 'pending',
      })
    })
    setEntries((prev) => [...prev, ...valid])
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }

  const removeEntry = (id: string) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id)
      if (entry) URL.revokeObjectURL(entry.previewUrl)
      return prev.filter((e) => e.id !== id)
    })
  }

  const updateAltText = (id: string, value: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, altText: value } : e))
  }

  const handleUploadAll = async () => {
    const pending = entries.filter((e) => e.status === 'pending')
    if (pending.length === 0) return

    setIsRunning(true)

    // Base display order = after existing images
    const baseOrder = existingImages.length

    await Promise.all(
      pending.map(async (entry, idx) => {
        setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: 'uploading' } : e))
        try {
          const result = await upload(entry.file)
          if (!result) throw new Error('Upload failed')

          await createGalleryImage({
            sessionToken: sessionToken!,
            imageUrl: result.publicUrl,
            altText: entry.altText.trim() || entry.file.name,
            displayOrder: baseOrder + idx,
            blurhash: result.blurhash ?? undefined,
          })

          setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: 'done' } : e))
        } catch (err) {
          setEntries((prev) => prev.map((e) =>
            e.id === entry.id
              ? { ...e, status: 'error', errorMsg: locale === 'ka' ? 'შეცდომა' : 'Failed' }
              : e
          ))
        }
      })
    )

    setIsRunning(false)
  }

  const allDone = entries.length > 0 && entries.every((e) => e.status === 'done')
  const pendingCount = entries.filter((e) => e.status === 'pending').length
  const uploadingCount = entries.filter((e) => e.status === 'uploading').length
  const errorCount = entries.filter((e) => e.status === 'error').length

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (!isRunning) onClose() }}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-surface-container-lowest border-0 sm:border border-outline-variant/30 w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-outline-variant/20 shrink-0">
          <div>
            <h2 className="font-[EB_Garamond] text-[26px] text-primary">
              {locale === 'ka' ? 'სურათების ატვირთვა' : 'Upload Images'}
            </h2>
            {entries.length > 0 && (
              <p className="font-[Hanken_Grotesk] text-[12px] text-secondary mt-0.5">
                {entries.length} {locale === 'ka' ? 'სურათი' : 'images selected'}
                {errorCount > 0 && ` · ${errorCount} ${locale === 'ka' ? 'შეცდომა' : 'failed'}`}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isRunning}
            className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40"
            aria-label={t('admin.common.close')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drop zone */}
        <div
          className={`mx-4 sm:mx-8 mt-4 sm:mt-6 shrink-0 border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center gap-2 py-6 cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileInput}
              className="sr-only"
              disabled={isRunning}
            />
            <span className="material-symbols-outlined text-[32px] text-secondary/50">
              {isDragging ? 'file_download' : 'add_photo_alternate'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[13px] text-secondary text-center">
              {locale === 'ka'
                ? 'გადმოიტანეთ სურათები ან დააჭირეთ ასარჩევად'
                : 'Drop images here or click to select'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[11px] text-secondary/60">
              JPEG, PNG, WebP · {locale === 'ka' ? 'მრავალი ფაილი' : 'multiple files supported'}
            </span>
          </label>
        </div>

        {/* File list */}
        {entries.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 flex flex-col gap-3 min-h-0">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-3 border transition-colors ${
                  entry.status === 'done'
                    ? 'border-primary/20 bg-primary/5'
                    : entry.status === 'error'
                    ? 'border-error/20 bg-error/5'
                    : 'border-outline-variant/30'
                }`}
              >
                {/* Thumbnail */}
                <img
                  src={entry.previewUrl}
                  alt=""
                  className="w-14 h-14 object-cover shrink-0"
                />

                {/* Alt text input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={entry.altText}
                    onChange={(e) => updateAltText(entry.id, e.target.value)}
                    disabled={entry.status !== 'pending'}
                    placeholder={locale === 'ka' ? 'სურათის აღწერა' : 'Image description'}
                    className="w-full bg-transparent border-b border-outline-variant/40 pb-1 font-[Hanken_Grotesk] text-[13px] text-on-surface outline-none focus:border-primary transition-colors disabled:opacity-60 truncate"
                  />
                  <p className="font-[Hanken_Grotesk] text-[11px] text-secondary/60 mt-1 truncate">
                    {entry.file.name}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 w-7 flex items-center justify-center">
                  {entry.status === 'pending' && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-secondary/50 hover:text-error transition-colors"
                      aria-label="Remove"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                  {entry.status === 'uploading' && (
                    <span className="material-symbols-outlined text-[18px] text-primary animate-spin">
                      progress_activity
                    </span>
                  )}
                  {entry.status === 'done' && (
                    <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                  {entry.status === 'error' && (
                    <span className="material-symbols-outlined text-[18px] text-error" title={entry.errorMsg}>
                      error
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-outline-variant/20 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allDone ? t('admin.common.close') : t('admin.common.cancel')}
          </button>

          {!allDone && (
            <button
              onClick={handleUploadAll}
              disabled={isRunning || pendingCount === 0}
              className="px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  {uploadingCount > 0
                    ? `${locale === 'ka' ? 'იტვირთება' : 'Uploading'} ${uploadingCount}…`
                    : t('admin.common.uploading')}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {pendingCount > 1
                    ? `${locale === 'ka' ? 'ყველას ატვირთვა' : 'Upload All'} (${pendingCount})`
                    : locale === 'ka' ? 'ატვირთვა' : 'Upload'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
