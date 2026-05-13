import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { SponsorRow } from '@/components/admin/SponsorRow'
import { SponsorFormDialog } from '@/components/admin/SponsorFormDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'

type Sponsor = Doc<"sponsors">

export function SponsorsTab() {
  const { locale, t } = useI18n()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)

  const sponsors = useQuery(api.sponsors.list) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-[EB_Garamond] text-[28px] text-primary">
          {t('admin.sponsors.title')}
        </h3>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t('admin.sponsors.addSponsor')}
        </button>
      </div>

      {sponsors.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
          <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
            handshake
          </span>
          <p>{t('admin.sponsors.noSponsors')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sponsors.map((sponsor) => (
            <SponsorRow
              key={sponsor._id}
              sponsor={sponsor}
              onEdit={() => setEditingSponsor(sponsor)}
            />
          ))}
        </div>
      )}

      <SponsorFormDialog
        isOpen={isAddDialogOpen || editingSponsor !== null}
        sponsor={editingSponsor}
        onClose={() => {
          setIsAddDialogOpen(false)
          setEditingSponsor(null)
        }}
      />
    </div>
  )
}



