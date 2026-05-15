import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
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

interface SponsorRowProps {
  sponsor: Sponsor
  onEdit: () => void
}

export function SponsorRow({ sponsor, onEdit }: SponsorRowProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const removeSponsor = useMutation(api.sponsors.remove)

  const handleDelete = async () => {
    await removeSponsor({ sessionToken: sessionToken!, id: sponsor._id })
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 transition-all duration-300">
        {/* Top row: logo + info */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Logo thumbnail */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-surface-container-high overflow-hidden flex items-center justify-center">
            {sponsor.logoUrl ? (
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="material-symbols-outlined text-[24px] sm:text-[28px] text-on-surface-variant/30">
                image
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-[EB_Garamond] text-[16px] sm:text-[18px] text-primary truncate">{sponsor.name}</h4>
            <a
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[Hanken_Grotesk] text-[12px] sm:text-[13px] text-secondary hover:underline truncate block"
            >
              {sponsor.websiteUrl}
            </a>
          </div>

          {/* Display order - hidden on mobile, shown inline on desktop */}
          <div className="flex-shrink-0 text-center px-3 hidden md:block">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-0.5">
              {locale === 'ka' ? 'რიგი' : 'Order'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[16px] font-semibold text-on-surface">
              {sponsor.displayOrder}
            </span>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
          {/* Mobile order badge */}
          <span className="md:hidden font-[Hanken_Grotesk] text-[11px] text-on-surface-variant mr-auto">
            #{sponsor.displayOrder}
          </span>
          <button
            onClick={onEdit}
            className="border border-outline-variant text-on-surface-variant hover:bg-surface-container-high px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">edit</span>
            {t('admin.common.edit')}
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="border border-error/30 text-error hover:bg-error/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">delete</span>
            {t('admin.common.delete')}
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={t('admin.sponsors.deleteTitle')}
        description={
          locale === 'ka'
            ? `დარწმუნებული ხართ, რომ გსურთ "${sponsor.name}" წაშლა? ეს მოქმედება შეუქცევადია.`
            : `Are you sure you want to delete "${sponsor.name}"? This action cannot be undone.`
        }
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
      />
    </>
  )
}
