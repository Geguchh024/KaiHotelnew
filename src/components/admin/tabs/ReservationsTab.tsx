import { useState, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ReservationRow } from '@/components/admin/ReservationRow'
import { ReservationDetailPanel } from '@/components/admin/ReservationDetailPanel'
import { ReservationFilters } from '@/components/admin/ReservationFilters'
import { ReservationTimelineView } from '@/components/admin/ReservationTimelineView'
import { WalkInModal } from '@/components/admin/WalkInModal'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { transitionPrompt } from '@/components/admin/transitionPrompt'
import { filterReservations } from '../../../utils/filterReservations'
import type { ReservationFilterCriteria } from '../../../utils/filterReservations'
import type { Reservation } from '@/components/admin/ReservationRow'
import type { Transition } from '../../../../convex/availability'
import type { Id } from '../../../../convex/_generated/dataModel'

type ViewTab = 'active' | 'archive' | 'timeline'

const ACTIVE_STATUSES = new Set(['pending', 'confirmed', 'checkedIn'])
const ARCHIVE_STATUSES = new Set(['checkedOut', 'cancelled', 'noShow'])

export function ReservationsTab() {
  const { t, locale } = useI18n()
  const { sessionToken } = useAdminAuth()

  const [viewTab, setViewTab] = useState<ViewTab>('active')
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [walkInOpen, setWalkInOpen] = useState(false)
  const [criteria, setCriteria] = useState<ReservationFilterCriteria>({
    status: 'all',
    roomId: null,
    checkInFrom: null,
    checkInTo: null,
    search: '',
  })
  // Pending transition awaiting confirmation. The dialog routes every status
  // change (confirm / check-in / check-out / mark no-show / cancel) through a
  // confirmation step so admins never trigger an irreversible state with one tap.
  const [pendingTransition, setPendingTransition] = useState<{
    reservation: Reservation
    transition: Transition
  } | null>(null)

  // Load the full reservation set so the Active/Archive lists, timeline, and
  // analytics are all computed from the same complete, consistent data.
  const allReservations = useQuery(
    api.reservations.listAll,
    sessionToken ? { sessionToken } : 'skip',
  )

  const rooms = useQuery(api.rooms.list) ?? []
  const transitionMutation = useMutation(api.reservations.transitionStatus)

  const reservations = useMemo(() => {
    const all = (allReservations ?? []) as Reservation[]
    // listAll returns ascending by createdAt; show newest first in the lists.
    return [...all].sort((a, b) => b.createdAt - a.createdAt)
  }, [allReservations])

  const isLoading = allReservations === undefined

  const roomNameMap: Record<string, string> = {}
  for (const room of rooms) {
    roomNameMap[room._id] = locale === 'ka' ? room.nameKa : room.nameEn
  }

  const activeReservations = useMemo(
    () => reservations.filter((r) => ACTIVE_STATUSES.has(r.status)),
    [reservations],
  )
  const archiveReservations = useMemo(
    () => reservations.filter((r) => ARCHIVE_STATUSES.has(r.status)),
    [reservations],
  )

  const currentList = viewTab === 'active' ? activeReservations : archiveReservations
  const filtered = filterReservations(currentList, criteria)

  // Revenue analytics
  const analytics = useMemo(() => {
    const thisMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    ).getTime()
    const lastMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1,
    ).getTime()
    const completedStatuses = new Set(['checkedOut', 'confirmed', 'checkedIn'])

    const revenueReservations = reservations.filter((r) =>
      completedStatuses.has(r.status),
    )
    const totalRevenue = revenueReservations.reduce(
      (sum, r) => sum + r.totalPrice,
      0,
    )
    const thisMonthRevenue = revenueReservations
      .filter((r) => r.createdAt >= thisMonthStart)
      .reduce((sum, r) => sum + r.totalPrice, 0)
    const lastMonthRevenue = revenueReservations
      .filter((r) => r.createdAt >= lastMonthStart && r.createdAt < thisMonthStart)
      .reduce((sum, r) => sum + r.totalPrice, 0)

    const totalBookings = reservations.length
    const activeBookings = activeReservations.length
    const completedBookings = reservations.filter(
      (r) => r.status === 'checkedOut',
    ).length
    const cancelledBookings = reservations.filter(
      (r) => r.status === 'cancelled',
    ).length
    const avgBookingValue =
      revenueReservations.length > 0
        ? totalRevenue / revenueReservations.length
        : 0
    const occupancyNights = revenueReservations.reduce(
      (sum, r) => sum + Math.round((r.checkOutDate - r.checkInDate) / 86_400_000),
      0,
    )
    const cancellationRate =
      totalBookings > 0
        ? Math.round((cancelledBookings / totalBookings) * 100)
        : 0

    return {
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      avgBookingValue: Math.round(avgBookingValue),
      occupancyNights,
      cancellationRate,
    }
  }, [reservations, activeReservations])

  const handleSelectReservation = (reservation: Reservation) => {
    setSelectedReservation(
      selectedReservation?._id === reservation._id ? null : reservation,
    )
  }
  const handleCloseDetail = () => setSelectedReservation(null)

  // All row-level transitions are confirmed. The detail panel triggers its
  // own dialog and submits directly, so this path is just the row buttons.
  const handleTransitionRequest = (
    id: Id<'reservations'>,
    transition: Transition,
  ) => {
    const target = reservations.find((r) => r._id === id)
    if (!target) return
    setPendingTransition({ reservation: target, transition })
  }

  const handleConfirmTransition = async () => {
    if (!sessionToken || !pendingTransition) return
    await transitionMutation({
      sessionToken,
      id: pendingTransition.reservation._id,
      transition: pendingTransition.transition,
    })
    setPendingTransition(null)
  }

  // Localized prompt text + tone for the active transition (if any).
  const promptCopy = pendingTransition
    ? transitionPrompt(pendingTransition.transition, locale, {
        guestName: pendingTransition.reservation.guestFullName,
      })
    : null

  const tabs: {
    key: ViewTab
    icon: string
    label: string
    count: number | null
  }[] = [
    {
      key: 'active',
      icon: 'event_available',
      label: locale === 'ka' ? 'აქტიური' : 'Active',
      count: activeReservations.length,
    },
    {
      key: 'archive',
      icon: 'inventory_2',
      label: locale === 'ka' ? 'არქივი' : 'Archive',
      count: archiveReservations.length,
    },
    {
      key: 'timeline',
      icon: 'view_timeline',
      label: locale === 'ka' ? 'ტაიმლაინი' : 'Timeline',
      count: null,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-baseline justify-between sm:justify-start gap-3">
          <h3 className="font-[EB_Garamond] text-[22px] sm:text-[28px] text-primary">
            {t('admin.reservations.title')}
          </h3>
          <span className="font-[Hanken_Grotesk] text-[12px] sm:text-[13px] text-on-surface-variant whitespace-nowrap">
            {locale === 'ka'
              ? `${reservations.length} სულ`
              : `${reservations.length} total`}
          </span>
        </div>
        <button
          onClick={() => setWalkInOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[12px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity rounded-sm"
        >
          <span className="material-symbols-outlined text-[16px]">person_add</span>
          {locale === 'ka' ? 'Walk-in ჯავშანი' : 'New Walk-in'}
        </button>
      </div>

      {/* View Tabs — full-width segmented on mobile, underline on desktop */}
      <div
        role="tablist"
        className="grid grid-cols-3 sm:flex sm:items-center sm:gap-1 mb-5 sm:mb-6 rounded-full sm:rounded-none bg-surface-container-low sm:bg-transparent p-1 sm:p-0 sm:border-b sm:border-outline-variant/30"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={viewTab === tab.key}
            onClick={() => setViewTab(tab.key)}
            className={[
              'flex items-center justify-center gap-1.5 py-2 sm:py-3 sm:px-4 font-[Hanken_Grotesk] text-[12px] font-semibold transition-all',
              // Mobile pill / desktop underline
              'rounded-full sm:rounded-none sm:border-b-2 sm:-mb-px',
              viewTab === tab.key
                ? 'bg-surface-container-lowest sm:bg-transparent text-primary sm:border-primary shadow-sm sm:shadow-none'
                : 'text-on-surface-variant sm:border-transparent hover:text-primary sm:hover:border-primary/30',
            ].join(' ')}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="material-symbols-outlined text-primary text-[28px] animate-spin">
                progress_activity
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
              <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
                {viewTab === 'active' ? 'event_available' : 'inventory_2'}
              </span>
              <p>
                {viewTab === 'active'
                  ? locale === 'ka'
                    ? 'აქტიური რეზერვაციები არ არის'
                    : 'No active reservations'
                  : locale === 'ka'
                  ? 'არქივი ცარიელია'
                  : 'No archived reservations'}
              </p>
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
                    onTransition={handleTransitionRequest}
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

      {/* Timeline view */}
      {viewTab === 'timeline' && <ReservationTimelineView rooms={rooms} />}

      {/* Revenue & Analytics Section — below all content */}
      <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-outline-variant/30">
        <h4 className="font-[EB_Garamond] text-[18px] sm:text-[24px] text-primary mb-4 sm:mb-5">
          {locale === 'ka' ? 'შემოსავლები და ანალიტიკა' : 'Revenue & Analytics'}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
          <StatCard
            icon="payments"
            label={locale === 'ka' ? 'მთლიანი შემოსავალი' : 'Total Revenue'}
            value={`₾${Math.round(analytics.totalRevenue).toLocaleString()}`}
          />
          <StatCard
            icon="calendar_month"
            label={locale === 'ka' ? 'ამ თვის შემოსავალი' : 'This Month'}
            value={`₾${Math.round(analytics.thisMonthRevenue).toLocaleString()}`}
            subtext={
              analytics.lastMonthRevenue > 0
                ? `${
                    locale === 'ka' ? 'წინა თვე' : 'Last month'
                  }: ₾${Math.round(analytics.lastMonthRevenue).toLocaleString()}`
                : undefined
            }
          />
          <StatCard
            icon="avg_pace"
            label={locale === 'ka' ? 'საშუალო ღირებულება' : 'Avg. Booking Value'}
            value={`₾${analytics.avgBookingValue.toLocaleString()}`}
          />
          <StatCard
            icon="dark_mode"
            label={locale === 'ka' ? 'სულ ღამეები' : 'Total Nights Sold'}
            value={String(analytics.occupancyNights)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            icon="book_online"
            label={locale === 'ka' ? 'სულ ჯავშნები' : 'Total Bookings'}
            value={String(analytics.totalBookings)}
          />
          <StatCard
            icon="event_available"
            label={locale === 'ka' ? 'აქტიური' : 'Active'}
            value={String(analytics.activeBookings)}
          />
          <StatCard
            icon="check_circle"
            label={locale === 'ka' ? 'დასრულებული' : 'Completed'}
            value={String(analytics.completedBookings)}
          />
          <StatCard
            icon="cancel"
            label={locale === 'ka' ? 'გაუქმებული' : 'Cancelled'}
            value={String(analytics.cancelledBookings)}
            subtext={`${analytics.cancellationRate}% ${
              locale === 'ka' ? 'გაუქმების მაჩვენებელი' : 'cancellation rate'
            }`}
          />
        </div>
      </div>

      {/* Confirmation dialog — shared by every row-level transition.
          The detail panel handles its own confirmations internally. */}
      <ConfirmationDialog
        isOpen={pendingTransition !== null && promptCopy !== null}
        title={promptCopy?.title ?? ''}
        description={promptCopy?.description ?? ''}
        onConfirm={() => void handleConfirmTransition()}
        onCancel={() => setPendingTransition(null)}
        confirmLabel={promptCopy?.confirmLabel}
        cancelLabel={promptCopy?.cancelLabel}
        tone={promptCopy?.tone}
        icon={promptCopy?.icon}
      />

      {/* Walk-in modal */}
      <WalkInModal
        isOpen={walkInOpen}
        onClose={() => setWalkInOpen(false)}
        rooms={rooms}
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: string
  label: string
  value: string
  subtext?: string
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-2.5 sm:p-4 flex flex-col gap-1.5 hover:border-primary/30 transition-colors rounded-sm">
      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-secondary">
          {icon}
        </span>
        <span className="font-[Hanken_Grotesk] text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant truncate">
          {label}
        </span>
      </div>
      <p className="font-[EB_Garamond] text-[20px] sm:text-[28px] leading-none text-primary">
        {value}
      </p>
      {subtext && (
        <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">
          {subtext}
        </span>
      )}
    </div>
  )
}
