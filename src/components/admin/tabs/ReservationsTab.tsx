import { useState, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ReservationRow } from '@/components/admin/ReservationRow'
import { ReservationDetailPanel } from '@/components/admin/ReservationDetailPanel'
import { ReservationFilters } from '@/components/admin/ReservationFilters'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { filterReservations } from '../../../utils/filterReservations'
import type { ReservationFilterCriteria } from '../../../utils/filterReservations'
import type { Reservation } from '@/components/admin/ReservationRow'
import type { Transition } from '../../../../convex/availability'
import type { Id } from '../../../../convex/_generated/dataModel'

type ViewTab = 'active' | 'archive' | 'calendar'

const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'checkedIn'])
const ARCHIVE_STATUSES = new Set(['checkedOut', 'cancelled', 'noShow'])

export function ReservationsTab() {
  const { t, locale } = useI18n()
  const { sessionToken } = useAdminAuth()

  const [viewTab, setViewTab] = useState<ViewTab>('active')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [criteria, setCriteria] = useState<ReservationFilterCriteria>({
    status: 'all',
    roomId: null,
    checkInFrom: null,
    checkInTo: null,
    search: '',
  })
  const [cancelTarget, setCancelTarget] = useState<Id<"reservations"> | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const result = useQuery(
    api.reservations.listPaginated,
    sessionToken ? { sessionToken, paginationOpts: { numItems: 100, cursor: null } } : 'skip'
  )

  const rooms = useQuery(api.rooms.list) ?? []
  const transitionMutation = useMutation(api.reservations.transitionStatus)
  const reservations = (result?.page ?? []) as Reservation[]

  const roomNameMap: Record<string, string> = {}
  for (const room of rooms) {
    roomNameMap[room._id] = locale === 'ka' ? room.nameKa : room.nameEn
  }

  const activeReservations = useMemo(
    () => reservations.filter((r) => ACTIVE_STATUSES.has(r.status)),
    [reservations]
  )
  const archiveReservations = useMemo(
    () => reservations.filter((r) => ARCHIVE_STATUSES.has(r.status)),
    [reservations]
  )

  const currentList = viewTab === 'active' ? activeReservations : archiveReservations
  const filtered = filterReservations(currentList, criteria)

  // Revenue analytics
  const analytics = useMemo(() => {
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime()
    const completedStatuses = new Set(['checkedOut', 'confirmed', 'checkedIn'])

    const revenueReservations = reservations.filter((r) => completedStatuses.has(r.status))
    const totalRevenue = revenueReservations.reduce((sum, r) => sum + r.totalPrice, 0)
    const thisMonthRevenue = revenueReservations
      .filter((r) => r.createdAt >= thisMonthStart)
      .reduce((sum, r) => sum + r.totalPrice, 0)
    const lastMonthRevenue = revenueReservations
      .filter((r) => r.createdAt >= lastMonthStart && r.createdAt < thisMonthStart)
      .reduce((sum, r) => sum + r.totalPrice, 0)

    const totalBookings = reservations.length
    const activeBookings = activeReservations.length
    const completedBookings = reservations.filter((r) => r.status === 'checkedOut').length
    const cancelledBookings = reservations.filter((r) => r.status === 'cancelled').length
    const noShowBookings = reservations.filter((r) => r.status === 'noShow').length
    const avgBookingValue = revenueReservations.length > 0 ? totalRevenue / revenueReservations.length : 0
    const occupancyNights = revenueReservations
      .reduce((sum, r) => sum + Math.round((r.checkOutDate - r.checkInDate) / 86_400_000), 0)
    const cancellationRate = totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0

    return { totalRevenue, thisMonthRevenue, lastMonthRevenue, totalBookings, activeBookings, completedBookings, cancelledBookings, noShowBookings, avgBookingValue: Math.round(avgBookingValue), occupancyNights, cancellationRate }
  }, [reservations, activeReservations])

  // Calendar: show ALL reservations (all statuses, all rooms, past and future)
  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()

    const days: { date: number; reservations: Reservation[] }[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      const dayMs = Date.UTC(year, month, d)
      const dayReservations = reservations.filter((r) => {
        return r.checkInDate <= dayMs && r.checkOutDate > dayMs
      })
      days.push({ date: d, reservations: dayReservations })
    }
    return { days, firstDayOfWeek, year, month, daysInMonth }
  }, [calendarMonth, reservations])

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(selectedReservation?._id === reservation._id ? null : reservation)
  }
  const handleCloseDetail = () => setSelectedReservation(null)

  const handleTransition = async (id: Id<"reservations">, transition: Transition) => {
    if (!sessionToken) return
    if (transition === 'cancel') { setCancelTarget(id); return }
    await transitionMutation({ sessionToken, id, transition })
  }
  const handleConfirmCancel = async () => {
    if (!sessionToken || !cancelTarget) return
    await transitionMutation({ sessionToken, id: cancelTarget, transition: 'cancel' })
    setCancelTarget(null)
  }

  const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
  const monthLabel = calendarMonth.toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', { month: 'long', year: 'numeric' })
  const weekDays = locale === 'ka' ? ['კვ', 'ორ', 'სა', 'ოთ', 'ხუ', 'პა', 'შა'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h3 className="font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary">
          {t('admin.reservations.title')}
        </h3>
        <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant">
          {locale === 'ka' ? `სულ ${reservations.length} რეზერვაცია` : `${reservations.length} total reservations`}
        </span>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-outline-variant/30">
        {([
          { key: 'active' as ViewTab, icon: 'event_available', label: locale === 'ka' ? 'აქტიური' : 'Active', count: activeReservations.length },
          { key: 'archive' as ViewTab, icon: 'inventory_2', label: locale === 'ka' ? 'არქივი' : 'Archive', count: archiveReservations.length },
          { key: 'calendar' as ViewTab, icon: 'calendar_month', label: locale === 'ka' ? 'კალენდარი' : 'Calendar', count: null },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewTab(tab.key)}
            className={[
              'flex items-center gap-1.5 px-3 sm:px-4 py-3 font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold transition-colors border-b-2 -mb-px',
              viewTab === tab.key ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== null && (
              <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active / Archive list view */}
      {(viewTab === 'active' || viewTab === 'archive') && (
        <>
          <ReservationFilters criteria={criteria} onChange={setCriteria} rooms={rooms} />
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
              <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
                {viewTab === 'active' ? 'event_available' : 'inventory_2'}
              </span>
              <p>{viewTab === 'active' ? (locale === 'ka' ? 'აქტიური რეზერვაციები არ არის' : 'No active reservations') : (locale === 'ka' ? 'არქივი ცარიელია' : 'No archived reservations')}</p>
            </div>
          ) : (
            <div className="border border-outline-variant/30 rounded-sm overflow-hidden">
              {filtered.map((reservation) => (
                <div key={reservation._id}>
                  <ReservationRow
                    reservation={reservation}
                    roomName={roomNameMap[reservation.roomId] ?? '—'}
                    isSelected={selectedReservation?._id === reservation._id}
                    onSelect={handleSelectReservation}
                    onTransition={(id, tr) => void handleTransition(id, tr)}
                  />
                  {selectedReservation?._id === reservation._id && (
                    <ReservationDetailPanel
                      reservation={selectedReservation}
                      roomName={roomNameMap[reservation.roomId] ?? '—'}
                      onClose={handleCloseDetail}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Calendar view */}
      {viewTab === 'calendar' && (
        <div className="border border-outline-variant/30 rounded-sm overflow-hidden bg-surface-container-lowest">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
            <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" aria-label="Previous month">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <h4 className="font-[Hanken_Grotesk] text-[14px] sm:text-[16px] font-semibold text-primary capitalize">{monthLabel}</h4>
            <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors" aria-label="Next month">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-outline-variant/20">
            {weekDays.map((day) => (
              <div key={day} className="py-2 text-center font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: calendarData.firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[60px] sm:min-h-[80px] border-b border-r border-outline-variant/10 bg-surface-container-low/30" />
            ))}
            {calendarData.days.map(({ date, reservations: dayRes }) => {
              const isToday = (() => { const now = new Date(); return date === now.getDate() && calendarData.month === now.getMonth() && calendarData.year === now.getFullYear() })()
              const isPast = (() => { const dayMs = Date.UTC(calendarData.year, calendarData.month, date); return dayMs < Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) })()
              return (
                <div key={date} className={['min-h-[60px] sm:min-h-[80px] p-1 sm:p-1.5 border-b border-r border-outline-variant/10 relative', isToday ? 'bg-primary/5' : isPast ? 'bg-surface-container-low/20' : ''].join(' ')}>
                  <span className={['font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold block mb-0.5', isToday ? 'text-primary' : isPast ? 'text-on-surface-variant/50' : 'text-on-surface-variant'].join(' ')}>{date}</span>
                  {dayRes.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                      {dayRes.slice(0, 3).map((r) => (
                        <div key={r._id} className={['text-[7px] sm:text-[9px] font-[Hanken_Grotesk] font-semibold px-1 py-0.5 rounded-sm truncate', getStatusColor(r.status)].join(' ')} title={`${r.guestFullName} - ${roomNameMap[r.roomId] ?? ''}`}>
                          <span className="hidden sm:inline">{r.guestFullName.split(' ')[0]}</span>
                          <span className="sm:hidden">{r.guestFullName.charAt(0)}</span>
                        </div>
                      ))}
                      {dayRes.length > 3 && (
                        <span className="text-[8px] font-[Hanken_Grotesk] text-on-surface-variant font-semibold px-1">+{dayRes.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Calendar legend */}
          <div className="px-4 sm:px-6 py-3 border-t border-outline-variant/20 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" /><span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{locale === 'ka' ? 'მოლოდინში' : 'Pending'}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300" /><span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{locale === 'ka' ? 'დადასტურებული' : 'Confirmed'}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-100 border border-green-300" /><span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{locale === 'ka' ? 'შესული' : 'Checked In'}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300" /><span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{locale === 'ka' ? 'გასული' : 'Checked Out'}</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-100 border border-red-300" /><span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{locale === 'ka' ? 'გაუქმებული' : 'Cancelled'}</span></div>
          </div>
        </div>
      )}

      {/* Revenue & Analytics Section — below all content */}
      <div className="mt-10 pt-8 border-t border-outline-variant/30">
        <h4 className="font-[EB_Garamond] text-[20px] sm:text-[24px] text-primary mb-5">
          {locale === 'ka' ? 'შემოსავლები და ანალიტიკა' : 'Revenue & Analytics'}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon="payments" label={locale === 'ka' ? 'მთლიანი შემოსავალი' : 'Total Revenue'} value={`₾${Math.round(analytics.totalRevenue).toLocaleString()}`} />
          <StatCard icon="calendar_month" label={locale === 'ka' ? 'ამ თვის შემოსავალი' : 'This Month'} value={`₾${Math.round(analytics.thisMonthRevenue).toLocaleString()}`} subtext={analytics.lastMonthRevenue > 0 ? `${locale === 'ka' ? 'წინა თვე' : 'Last month'}: ₾${Math.round(analytics.lastMonthRevenue).toLocaleString()}` : undefined} />
          <StatCard icon="avg_pace" label={locale === 'ka' ? 'საშუალო ღირებულება' : 'Avg. Booking Value'} value={`₾${analytics.avgBookingValue.toLocaleString()}`} />
          <StatCard icon="dark_mode" label={locale === 'ka' ? 'სულ ღამეები' : 'Total Nights Sold'} value={String(analytics.occupancyNights)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon="book_online" label={locale === 'ka' ? 'სულ ჯავშნები' : 'Total Bookings'} value={String(analytics.totalBookings)} />
          <StatCard icon="event_available" label={locale === 'ka' ? 'აქტიური' : 'Active'} value={String(analytics.activeBookings)} />
          <StatCard icon="check_circle" label={locale === 'ka' ? 'დასრულებული' : 'Completed'} value={String(analytics.completedBookings)} />
          <StatCard icon="cancel" label={locale === 'ka' ? 'გაუქმებული' : 'Cancelled'} value={String(analytics.cancelledBookings)} subtext={`${analytics.cancellationRate}% ${locale === 'ka' ? 'გაუქმების მაჩვენებელი' : 'cancellation rate'}`} />
        </div>
      </div>

      {/* Cancel confirmation dialog */}
      <ConfirmationDialog
        isOpen={cancelTarget !== null}
        title={t('admin.reservations.confirmCancelTitle')}
        description={t('admin.reservations.confirmCancelDescription')}
        onConfirm={() => void handleConfirmCancel()}
        onCancel={() => setCancelTarget(null)}
        confirmLabel={t('admin.reservations.action.cancel')}
        cancelLabel={t('admin.common.cancel')}
      />
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800'
    case 'confirmed': return 'bg-blue-100 text-blue-800'
    case 'checkedIn': return 'bg-green-100 text-green-800'
    case 'checkedOut': return 'bg-slate-100 text-slate-600'
    case 'cancelled': return 'bg-red-100 text-red-700'
    case 'noShow': return 'bg-orange-100 text-orange-700'
    default: return 'bg-surface-container-high text-on-surface-variant'
  }
}

function StatCard({ icon, label, value, subtext }: { icon: string; label: string; value: string; subtext?: string }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 sm:p-4 flex flex-col gap-1.5 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px] text-secondary">{icon}</span>
        <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant truncate">{label}</span>
      </div>
      <p className="font-[EB_Garamond] text-[22px] sm:text-[28px] leading-none text-primary">{value}</p>
      {subtext && <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">{subtext}</span>}
    </div>
  )
}
