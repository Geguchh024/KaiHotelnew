import { useI18n } from '@/lib/i18n'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export function AnalyticsTab() {
  const { locale, t } = useI18n()

  const rooms = useQuery(api.rooms.list) ?? []
  const galleryImages = useQuery(api.gallery.list) ?? []
  const sponsors = useQuery(api.sponsors.list) ?? []
  const unreadMessages = useQuery(api.messages.unreadCount) ?? 0

  const stats = [
    {
      labelKey: 'admin.analytics.rooms',
      value: rooms?.length ?? 0,
      supportingKey: 'admin.analytics.roomsSupporting',
      icon: 'bed',
    },
    {
      labelKey: 'admin.analytics.gallery',
      value: galleryImages?.length ?? 0,
      supportingKey: 'admin.analytics.gallerySupporting',
      icon: 'photo_library',
    },
    {
      labelKey: 'admin.analytics.sponsors',
      value: sponsors?.length ?? 0,
      supportingKey: 'admin.analytics.sponsorsSupporting',
      icon: 'handshake',
    },
    {
      labelKey: 'admin.analytics.unreadMessages',
      value: unreadMessages ?? 0,
      supportingKey: 'admin.analytics.unreadMessagesSupporting',
      icon: 'mail',
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.labelKey}
          className="bg-surface-container-lowest border border-outline-variant/30 p-5 sm:p-8 flex flex-col justify-between min-h-[140px] sm:min-h-[180px] group hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-secondary uppercase tracking-[0.1em]">
              {t(stat.labelKey)}
            </span>
            <span className="material-symbols-outlined text-inverse-primary text-[22px]" aria-hidden="true">
              {stat.icon}
            </span>
          </div>
          <div>
            <p className="font-[EB_Garamond] text-[40px] sm:text-[56px] leading-none text-primary">
              {stat.value}
            </p>
            <p className="font-[Hanken_Grotesk] text-[13px] sm:text-[14px] text-on-surface-variant mt-2">
              {t(stat.supportingKey)}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}


