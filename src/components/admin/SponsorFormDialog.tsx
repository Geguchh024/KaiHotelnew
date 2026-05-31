import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useB2Upload } from '@/hooks/useB2Upload'
import { validateRequired, validateUrl } from '@/utils/formValidation'
import { validateImageFile } from '@/utils/fileValidation'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface Sponsor {
  _id: Id<"sponsors">
  name: string
  websiteUrl: string
  logoUrl: string
  displayOrder: number
  createdAt: number
  updatedAt: number
}

interface SponsorFormDialogProps {
  isOpen: boolean
  sponsor: Sponsor | null
  onClose: () => void
}

interface FormErrors {
  name?: string
  websiteUrl?: string
  displayOrder?: string
  logoUrl?: string
}

export function SponsorFormDialog({ isOpen, sponsor, onClose }: SponsorFormDialogProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const { upload, isUploading, error: uploadError } = useB2Upload()
  const createSponsor = useMutation(api.sponsors.create)
  const updateSponsor = useMutation(api.sponsors.update)

  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-populate when editing
  useEffect(() => {
    if (sponsor) {
      setName(sponsor.name)
      setWebsiteUrl(sponsor.websiteUrl)
      setDisplayOrder(String(sponsor.displayOrder))
      setLogoUrl(sponsor.logoUrl)
    } else {
      setName('')
      setWebsiteUrl('')
      setDisplayOrder('')
      setLogoUrl('')
    }
    setErrors({})
  }, [sponsor, isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      setErrors((prev) => ({ ...prev, logoUrl: validationError }))
      return
    }
    const result = await upload(file)
    if (result) {
      setLogoUrl(result.publicUrl)
      setErrors((prev) => ({ ...prev, logoUrl: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    const nameError = validateRequired(name)
    const websiteUrlError = validateUrl(websiteUrl)
    const displayOrderError = validateRequired(displayOrder)

    if (nameError) newErrors.name = nameError
    if (websiteUrlError) newErrors.websiteUrl = websiteUrlError
    if (displayOrderError) {
      newErrors.displayOrder = displayOrderError
    } else if (!Number.isInteger(Number(displayOrder)) || Number(displayOrder) < 0) {
      newErrors.displayOrder =
        locale === 'ka'
          ? 'გთხოვთ შეიყვანოთ არაუარყოფითი მთელი რიცხვი'
          : 'Please enter a non-negative integer'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      if (sponsor) {
        await updateSponsor({
          sessionToken: sessionToken!,
          id: sponsor._id,
          name,
          websiteUrl,
          displayOrder: Number(displayOrder),
          logoUrl,
        })
      } else {
        await createSponsor({
          sessionToken: sessionToken!,
          name,
          websiteUrl,
          displayOrder: Number(displayOrder),
          logoUrl,
        })
      }
      onClose()
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const isEditing = sponsor !== null
  const title = isEditing
    ? t('admin.sponsors.editSponsor')
    : t('admin.sponsors.addSponsor')

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-container-lowest border-0 sm:border border-outline-variant/30 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-8 bg-surface-container-lowest border-b border-outline-variant/20">
          <h2 className="font-[EB_Garamond] text-[20px] sm:text-[28px] text-primary truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors shrink-0"
            aria-label={t('admin.common.close')}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 flex flex-col gap-5 sm:gap-6">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.sponsors.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            {errors.name && (
              <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.name}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="flex flex-col gap-1">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.sponsors.websiteUrl')}
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            {errors.websiteUrl && (
              <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.websiteUrl}</p>
            )}
          </div>

          {/* Display order */}
          <div className="flex flex-col gap-1">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.sponsors.displayOrder')}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
            />
            {errors.displayOrder && (
              <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.displayOrder}</p>
            )}
          </div>

          {/* Logo upload */}
          <div className="flex flex-col gap-2">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.sponsors.logo')}
            </label>
            {logoUrl && (
              <div className="w-24 h-24 bg-surface-container-high flex items-center justify-center overflow-hidden rounded">
                <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
              </div>
            )}
            <label className="cursor-pointer border border-dashed border-outline-variant p-4 text-center hover:border-primary transition-colors rounded">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoChange}
                className="sr-only"
                disabled={isUploading}
              />
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant/50 block mb-1">
                upload
              </span>
              <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant">
                {isUploading
                  ? t('admin.common.uploading')
                  : locale === 'ka'
                    ? 'ლოგოს ატვირთვა'
                    : 'Upload logo'}
              </span>
            </label>
            {(errors.logoUrl || uploadError) && (
              <p className="text-error text-[12px] font-[Hanken_Grotesk]">
                {errors.logoUrl || uploadError}
              </p>
            )}
          </div>

          {/* Actions */}
          <div
            className="sticky bottom-0 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 sm:py-4 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-end gap-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  {t('admin.common.saving')}
                </>
              ) : isEditing ? (
                t('admin.common.update')
              ) : (
                t('admin.sponsors.addSponsor')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}



