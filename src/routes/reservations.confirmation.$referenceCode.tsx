import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'
import { format } from 'date-fns'
import { ka, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/reservations/confirmation/$referenceCode')({
  component: ConfirmationPage,
})

function ConfirmationPage() {
  const { referenceCode } = Route.useParams()
  const { t, locale } = useI18n()
  const dateLocale = locale === 'ka' ? ka : enUS

  const reservation = useQuery(api.reservations.getByReferenceCode, { referenceCode })
  const rooms = useQuery(api.rooms.list)

  // Loading state
  if (reservation === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[32px] animate-spin">progress_activity</span>
      </div>
    )
  }

  // Not found state
  if (reservation === null) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
          <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
            <Link to="/" className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity">
              Kai Hotel Bar
            </Link>
          </nav>
        </header>
        <main className="pt-[72px] min-h-screen bg-background flex items-center justify-center">
          <div className="text-center py-14 px-6">
            <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-error text-[28px]">search_off</span>
            </div>
            <h2 className="font-[EB_Garamond] text-[22px] text-primary mb-2 font-georgian">
              {locale === 'ka' ? 'რეზერვაცია ვერ მოიძებნა' : 'Reservation not found'}
            </h2>
            <p className="font-[Hanken_Grotesk] text-[12px] text-secondary mb-6 font-georgian">
              {locale === 'ka' ? 'მითითებული კოდით რეზერვაცია არ არსებობს.' : 'No reservation exists with the provided reference code.'}
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian">
              <span className="material-symbols-outlined text-[13px]">home</span>
              {t('res.backToHome')}
            </Link>
          </div>
        </main>
      </>
    )
  }

  // Find room name
  const room = rooms?.find((r) => r._id === reservation.roomId)
  const roomName = room
    ? (locale === 'ka' ? room.nameKa : room.nameEn)
    : (locale === 'ka' ? 'ნომერი' : 'Room')

  // Calculate night count
  const MS_PER_DAY = 86_400_000
  const nights = Math.round((reservation.checkOutDate - reservation.checkInDate) / MS_PER_DAY)

  // Format dates
  const checkInDate = new Date(reservation.checkInDate)
  const checkOutDate = new Date(reservation.checkOutDate)

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
        <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
          <Link to="/" className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity">
            Kai Hotel Bar
          </Link>
          <Link to="/" className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">
            {t('res.backToHome')}
          </Link>
        </nav>
      </header>

      <main className="pt-[72px] min-h-screen bg-background">
        <div className="bg-primary py-10 px-6">
          <div className="max-w-[1080px] mx-auto text-center">
            <div className="w-14 h-14 bg-on-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-on-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="font-[EB_Garamond] text-[26px] md:text-[34px] leading-[1.2] text-on-primary mb-2 font-georgian">
              {t('res.success')}
            </h1>
            <p className="font-[Hanken_Grotesk] text-[12px] leading-[1.5] text-on-primary/70 max-w-lg mx-auto font-georgian">
              {t('res.successDesc')}
            </p>
          </div>
        </div>

        <div className="max-w-[720px] mx-auto px-6 py-8 space-y-6">
          {/* Reference Code */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-5 text-center">
            <p className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-1 font-georgian">
              {locale === 'ka' ? 'საცნობარო კოდი' : 'Reference Code'}
            </p>
            <p className="font-[Hanken_Grotesk] text-[28px] font-bold text-primary tracking-[0.1em]">
              {reservation.referenceCode}
            </p>
          </div>

          {/* Reservation Details */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room & Dates */}
              <div>
                <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian">
                  {t('res.roomDetails')}
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{locale === 'ka' ? 'ნომერი' : 'Room'}</span>
                    <span className="text-primary font-semibold">{roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('booking.checkin')}</span>
                    <span className="text-primary font-semibold">{format(checkInDate, 'dd MMM yyyy', { locale: dateLocale })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('booking.checkout')}</span>
                    <span className="text-primary font-semibold">{format(checkOutDate, 'dd MMM yyyy', { locale: dateLocale })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('res.nights')}</span>
                    <span className="text-primary font-semibold">{nights}</span>
                  </div>
                  <div className="flex justify-between border-t border-outline-variant/20 pt-2 mt-2">
                    <span className="text-primary font-semibold font-georgian">{t('res.total')}</span>
                    <span className="text-primary font-bold text-[14px]">&#8382;{Math.round(reservation.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div>
                <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian">
                  {t('res.guestDetails')}
                </h4>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{locale === 'ka' ? 'სრული სახელი' : 'Full Name'}</span>
                    <span className="text-primary font-semibold">{reservation.guestFullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('res.email')}</span>
                    <span className="text-primary font-semibold">{reservation.guestEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('res.phone')}</span>
                    <span className="text-primary font-semibold">{reservation.guestPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-georgian">{t('booking.guests')}</span>
                    <span className="text-primary font-semibold">{reservation.guestCount}</span>
                  </div>
                  {reservation.specialRequests && (
                    <div className="pt-2 border-t border-outline-variant/20 mt-2">
                      <span className="text-secondary font-georgian block mb-0.5">{t('res.specialRequests')}</span>
                      <span className="text-primary text-[10px]">{reservation.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 flex items-center justify-between">
            <span className="font-[Hanken_Grotesk] text-[11px] text-secondary font-georgian">
              {locale === 'ka' ? 'სტატუსი' : 'Status'}
            </span>
            <StatusPill status={reservation.status} locale={locale} />
          </div>

          {/* Pay at Hotel notice */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-4 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
            <div>
              <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary font-georgian">{t('res.payAtHotel')}</p>
              <p className="font-[Hanken_Grotesk] text-[11px] text-secondary mt-0.5 font-georgian">{t('res.payAtHotelDesc')}</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4">
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian">
              <span className="material-symbols-outlined text-[13px]">home</span>
              {t('res.backToHome')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-3 px-6 max-w-[1280px] mx-auto">
          <div className="font-[EB_Garamond] text-[16px] font-medium text-primary">Kai Hotel Bar</div>
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-[13px]">call</span>
            <a href="tel:+995511222028" className="font-[Hanken_Grotesk] text-[11px] hover:text-primary transition-colors">{t('footer.phone')}</a>
          </div>
          <p className="font-[Hanken_Grotesk] text-[10px] text-secondary/60 font-georgian">{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  )
}

/** Status pill component for the confirmation page. */
function StatusPill({ status, locale }: { status: string; locale: 'ka' | 'en' }) {
  const labels: Record<string, { ka: string; en: string }> = {
    pending: { ka: 'მოლოდინში', en: 'Pending' },
    confirmed: { ka: 'დადასტურებული', en: 'Confirmed' },
    checkedIn: { ka: 'შესული', en: 'Checked In' },
    checkedOut: { ka: 'გასული', en: 'Checked Out' },
    cancelled: { ka: 'გაუქმებული', en: 'Cancelled' },
    noShow: { ka: 'არ გამოცხადდა', en: 'No Show' },
  }

  const colors: Record<string, string> = {
    pending: 'bg-surface-container-high text-on-surface-variant',
    confirmed: 'bg-primary/10 text-primary',
    checkedIn: 'bg-primary/10 text-primary',
    checkedOut: 'bg-green-100 text-green-800',
    cancelled: 'bg-error/10 text-error',
    noShow: 'bg-amber-100 text-amber-800',
  }

  const label = labels[status]?.[locale] ?? status
  const color = colors[status] ?? 'bg-surface-container-high text-on-surface-variant'

  return (
    <span className={cn('font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.03em] px-2.5 py-1 rounded-sm', color)}>
      {label}
    </span>
  )
}
