import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useB2Upload } from '@/hooks/useB2Upload'
import { validateRequired } from '@/utils/formValidation'
import { validateImageFile } from '@/utils/fileValidation'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface Room {
  _id: Id<"rooms">
  nameKa: string
  nameEn: string
  descriptionKa: string
  descriptionEn: string
  pricePerNight: number
  capacity: number
  amenities: string[]
  imageUrl: string
}

interface RoomFormDialogProps {
  isOpen: boolean
  room: Room | null
  onClose: () => void
}

interface FormErrors {
  nameKa?: string
  nameEn?: string
  pricePerNight?: string
  capacity?: string
  imageUrl?: string
}

export function RoomFormDialog({ isOpen, room, onClose }: RoomFormDialogProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const { upload, isUploading, error: uploadError } = useB2Upload()
  const createRoom = useMutation(api.rooms.create)
  const updateRoom = useMutation(api.rooms.update)

  const [nameKa, setNameKa] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [descriptionKa, setDescriptionKa] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [pricePerNight, setPricePerNight] = useState('')
  const [capacity, setCapacity] = useState('')
  const [amenities, setAmenities] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageBlurhash, setImageBlurhash] = useState<string | undefined>(undefined)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-populate when editing
  useEffect(() => {
    if (room) {
      setNameKa(room.nameKa)
      setNameEn(room.nameEn)
      setDescriptionKa(room.descriptionKa)
      setDescriptionEn(room.descriptionEn)
      setPricePerNight(String(room.pricePerNight))
      setCapacity(String(room.capacity))
      setAmenities(room.amenities.join(', '))
      setImageUrl(room.imageUrl)
    } else {
      setNameKa('')
      setNameEn('')
      setDescriptionKa('')
      setDescriptionEn('')
      setPricePerNight('')
      setCapacity('')
      setAmenities('')
      setImageUrl('')
    }
    setErrors({})
  }, [room, isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const validationError = validateImageFile(file)
    if (validationError) {
      setErrors((prev) => ({ ...prev, imageUrl: validationError }))
      return
    }
    const result = await upload(file)
    if (result) {
      setImageUrl(result.publicUrl)
      setImageBlurhash(result.blurhash ?? undefined)
      setErrors((prev) => ({ ...prev, imageUrl: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    const nameKaError = validateRequired(nameKa)
    const nameEnError = validateRequired(nameEn)
    const priceError = validateRequired(pricePerNight)
    const capacityError = validateRequired(capacity)
    if (nameKaError) newErrors.nameKa = nameKaError
    if (nameEnError) newErrors.nameEn = nameEnError
    if (priceError) newErrors.pricePerNight = priceError
    if (capacityError) newErrors.capacity = capacityError
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      if (room) {
        await updateRoom({
          sessionToken: sessionToken!,
          id: room._id,
          nameKa,
          nameEn,
          descriptionKa,
          descriptionEn,
          pricePerNight: Number(pricePerNight),
          capacity: Number(capacity),
          amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
          imageUrl,
          blurhash: imageBlurhash,
        })
      } else {
        await createRoom({
          sessionToken: sessionToken!,
          nameKa,
          nameEn,
          descriptionKa,
          descriptionEn,
          pricePerNight: Number(pricePerNight),
          capacity: Number(capacity),
          amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
          imageUrl,
          blurhash: imageBlurhash,
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

  const isEditing = room !== null
  const title = isEditing
    ? t('admin.rooms.editRoom')
    : t('admin.rooms.addRoom')

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-outline-variant/20">
          <h2 className="font-[EB_Garamond] text-[28px] text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          {/* Bilingual name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.nameKa')}
              </label>
              <input
                type="text"
                value={nameKa}
                onChange={(e) => setNameKa(e.target.value)}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
              {errors.nameKa && (
                <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.nameKa}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.nameEn')}
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
              {errors.nameEn && (
                <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.nameEn}</p>
              )}
            </div>
          </div>

          {/* Bilingual description fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.descriptionKa')}
              </label>
              <textarea
                value={descriptionKa}
                onChange={(e) => setDescriptionKa(e.target.value)}
                rows={3}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.descriptionEn')}
              </label>
              <textarea
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={3}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Price and capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.pricePerNight')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
              {errors.pricePerNight && (
                <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.pricePerNight}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
                {t('admin.rooms.capacity')}
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
              />
              {errors.capacity && (
                <p className="text-error text-[12px] font-[Hanken_Grotesk]">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-1">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.rooms.amenities')}
            </label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder={
                locale === 'ka' ? 'Wi-Fi, კონდიცი, სეიფი' : 'Wi-Fi, Air conditioning, Safe'
              }
              className="bg-transparent border-b border-outline-variant pb-2 font-[Hanken_Grotesk] text-[14px] text-on-surface outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-2">
            <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary">
              {t('admin.rooms.image')}
            </label>
            {imageUrl && (
              <img src={imageUrl} alt="Room preview" className="w-full h-40 object-cover rounded" />
            )}
            <label className="cursor-pointer border border-dashed border-outline-variant p-4 text-center hover:border-primary transition-colors rounded">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="sr-only"
                disabled={isUploading}
              />
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant/50 block mb-1">
                upload
              </span>
              <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant">
                {isUploading
                  ? t('admin.common.uploading')
                  : t('admin.common.uploadImage')}
              </span>
            </label>
            {(errors.imageUrl || uploadError) && (
              <p className="text-error text-[12px] font-[Hanken_Grotesk]">
                {errors.imageUrl || uploadError}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
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
                t('admin.rooms.addRoom')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}



