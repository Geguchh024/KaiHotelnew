import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { BlurhashImage } from '@/components/BlurhashImage'

interface GalleryImage {
  _id: Id<"galleryImages">
  imageUrl: string
  altText: string
  displayOrder: number
  blurhash?: string
  createdAt: number
}

interface GalleryImageCardProps {
  image: GalleryImage
}

export function GalleryImageCard({ image }: GalleryImageCardProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const removeImage = useMutation(api.gallery.remove)

  const handleDelete = async () => {
    await removeImage({ sessionToken: sessionToken!, id: image._id })
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden group hover:border-primary/30 transition-all duration-300">
        {/* Image thumbnail */}
        <div className="aspect-square bg-surface-container-high overflow-hidden">
          <BlurhashImage
            src={image.imageUrl}
            alt={image.altText}
            blurhash={image.blurhash}
            className="w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <p
            className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant mb-3 truncate"
            title={image.altText}
          >
            {image.altText}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant/60 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">sort</span>
              {locale === 'ka' ? 'თანმიმდევრობა' : 'Order'}: {image.displayOrder}
            </span>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="border border-error/30 text-error hover:bg-error/10 px-3 py-1.5 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center gap-1"
              aria-label={locale === 'ka' ? 'სურათის წაშლა' : 'Delete image'}
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              {t('admin.common.delete')}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={t('admin.gallery.deleteTitle')}
        description={
          locale === 'ka'
            ? 'დარწმუნებული ხართ, რომ გსურთ სურათის წაშლა? ეს მოქმედება შეუქცევადია.'
            : 'Are you sure you want to delete this image? This action cannot be undone.'
        }
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
      />
    </>
  )
}
