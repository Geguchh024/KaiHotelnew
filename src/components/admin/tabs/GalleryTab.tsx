import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { GalleryImageCard } from '@/components/admin/GalleryImageCard'
import { ImageUploadDialog } from '@/components/admin/ImageUploadDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'

type GalleryImage = Doc<"galleryImages">

export function GalleryTab() {
  const { locale, t } = useI18n()
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const images = useQuery(api.gallery.list) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-[EB_Garamond] text-[28px] text-primary">
          {t('admin.gallery.title')}
        </h3>
        <button
          onClick={() => setIsUploadDialogOpen(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">upload</span>
          {t('admin.gallery.uploadImage')}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
          <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
            photo_library
          </span>
          <p>{t('admin.gallery.noImages')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <GalleryImageCard key={image._id} image={image} />
          ))}
        </div>
      )}

      <ImageUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
    </div>
  )
}



