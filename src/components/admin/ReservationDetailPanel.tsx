import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { StatusBadge } from './StatusBadge'
import { ConfirmationDialog } from './ConfirmationDialog'
import { format } from 'date-fns'
import { ka, enUS, ru } from 'date-fns/locale'
import { allowedTransitions, nightCount } from '../../../convex/availability'
import type { Status, Transition } from '../../../convex/availability'
import type { Reservation } from './ReservationRow'
import { transitionPrompt } from './transitionPrompt'

interface ReservationDetailPanelProps {
  reservation: Reservation
  roomName: string
  onClose: () => void
}

const TRANSITION_ICONS: Record<Transition, string> = {
  confirm: 'check_circle',
  cancel: 'cancel',
  checkIn: 'login',
  checkOut: 'logout',
  markNoShow: 'person_off',
}

export function ReservationDetailPanel({
  reservation,
  roomName,
  onClose,
}: ReservationDetailPanelProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const transitionMutation = useMutation(api.reservations.transitionStatus)
  const dateLocale = locale === 'ka' ? ka : locale === 'ru' ? ru : enUS
  // Pending transition awaiting confirmation — covers every action the panel
  // can trigger so destructive AND state-changing operations always have a
  // second tap.
  const [pendingTransition, setPendingTransition] =
    useState<Transition | null>(null)

  // If this reservation is part of a multi-room group booking, load the
  // sibling reservations so the admin sees the full booking at a glance.
  const group = useQuery(
    api.reservations.getReservationGroup,
    reservation.bookingGroupId ? { referenceCode: reservation.referenceCode } : 'skip',
  )
  const groupSiblings = (group ?? []).filter((r) => r._id !== reservation._id)

  const nights = nightCount(reservation.checkInDate, reservation.checkOutDate)
  const transitions = allowedTransitions(reservation.status as Status)

  // Open the confirmation dialog instead of running the mutation directly.
  const requestTransition = (transition: Transition) => {
    setPendingTransition(transition)
  }

  const handleConfirmTransition = async () => {
    if (!sessionToken || !pendingTransition) return
    await transitionMutation({
      sessionToken,
      id: reservation._id,
      transition: pendingTransition,
    })
    setPendingTransition(null)
  }

  const promptCopy = pendingTransition
    ? transitionPrompt(pendingTransition, locale, {
        guestName: reservation.guestFullName,
        roomName,
      })
    : null

  function formatTimestamp(ts: number | undefined): string {
    if (!ts) return '—'
    return format(new Date(ts), 'd MMM yyyy, HH:mm', { locale: dateLocale })
  }

  return (
    <div className="border border-outline-variant/40 bg-surface-container-lowest rounded-sm mt-1 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/30 bg-surface-container-low">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="font-[EB_Garamond] text-[18px] sm:text-[20px] text-primary">
            {reservation.referenceCode}
          </h4>
          <StatusBadge status={reservation.status as Status} />
        </div>
        <button
          onClick={onClose}
          aria-label={t('admin.common.close')}
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full p-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Panel body */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Group-booking banner */}
        {groupSiblings.length > 0 && (
          <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-sm px-3 py-2.5">
            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">group_work</span>
            <div className="min-w-0">
              <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary">
                {locale === 'ka'
                  ? `ჯგუფური ჯავშანი — ${groupSiblings.length + 1} ნომერი`
                  : locale === 'ru'
                  ? `Групповое бронирование — ${groupSiblings.length + 1} номеров`
                  : `Group booking — ${groupSiblings.length + 1} rooms`}
              </p>
              <p className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant mt-0.5">
                {locale === 'ka' ? 'დაკავშირებული კოდები:' : locale === 'ru' ? 'Связанные коды:' : 'Linked codes:'}{' '}
                {groupSiblings.map((r) => r.referenceCode).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Guest info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.guest')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium">
              {reservation.guestFullName}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.messages.email')}
            </span>
            <a
              href={`mailto:${reservation.guestEmail}`}
              className="font-[Hanken_Grotesk] text-[15px] text-secondary hover:underline"
            >
              {reservation.guestEmail}
            </a>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('res.phone')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface">
              {reservation.guestPhone}
            </span>
          </div>
        </div>

        {/* Room & dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.room')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium">
              {roomName}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.dates')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {format(new Date(reservation.checkInDate), 'd MMM yyyy', { locale: dateLocale })}
              {' – '}
              {format(new Date(reservation.checkOutDate), 'd MMM yyyy', { locale: dateLocale })}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.nights')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface">
              {nights}
            </span>
          </div>
        </div>

        {/* Price & guest count */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.total')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface font-semibold">
              ${Math.round(reservation.totalPrice)}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.guestCount')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface">
              {reservation.guestCount}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.referenceCode')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface font-mono">
              {reservation.referenceCode}
            </span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.createdAt')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {formatTimestamp(reservation.createdAt)}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.checkedInAt')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {formatTimestamp(reservation.checkedInAt)}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.checkedOutAt')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {formatTimestamp(reservation.checkedOutAt)}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {t('admin.reservations.cancelledAt')}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {formatTimestamp(reservation.cancelledAt)}
            </span>
          </div>
        </div>

        {/* Special requests */}
        {reservation.specialRequests && (
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-2">
              {t('admin.reservations.specialRequests')}
            </span>
            <div className="bg-surface-container-high rounded-sm p-4 border border-outline-variant/20">
              <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap">
                {reservation.specialRequests}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {transitions.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 pt-3 border-t border-outline-variant/30 flex-wrap">
            {transitions.map((tr) => (
              <button
                key={tr}
                onClick={() => requestTransition(tr)}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold transition-all duration-200',
                  tr === 'cancel'
                    ? 'border border-error text-error hover:bg-error/10'
                    : 'bg-primary text-on-primary hover:opacity-90',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {TRANSITION_ICONS[tr]}
                </span>
                {t(`admin.reservations.action.${tr}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation dialog — every transition (confirm / check-in /
          check-out / mark no-show / cancel) requires a second tap so the
          admin never triggers an irreversible state by accident. */}
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
    </div>
  )
}
