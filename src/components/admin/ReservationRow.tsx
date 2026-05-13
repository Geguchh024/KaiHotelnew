import { useI18n } from '@/lib/i18n'
import { StatusBadge } from './StatusBadge'
import { format } from 'date-fns'
import { ka, enUS } from 'date-fns/locale'
import { allowedTransitions } from '../../../convex/availability'
import { nightCount } from '../../../convex/availability'
import type { Status, Transition } from '../../../convex/availability'
import type { Doc, Id } from '../../../convex/_generated/dataModel'

export type Reservation = Doc<"reservations">

interface ReservationRowProps {
  reservation: Reservation
  roomName: string
  isSelected: boolean
  onSelect: (reservation: Reservation) => void
  onTransition: (id: Id<"reservations">, transition: Transition) => void
}

const TRANSITION_ICONS: Record<Transition, string> = {
  confirm: 'check_circle',
  cancel: 'cancel',
  checkIn: 'login',
  checkOut: 'logout',
  markNoShow: 'person_off',
}

export function ReservationRow({
  reservation,
  roomName,
  isSelected,
  onSelect,
  onTransition,
}: ReservationRowProps) {
  const { locale, t } = useI18n()
  const dateLocale = locale === 'ka' ? ka : enUS

  const nights = nightCount(reservation.checkInDate, reservation.checkOutDate)
  const transitions = allowedTransitions(reservation.status as Status)

  const handleClick = () => {
    onSelect(reservation)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={[
        'flex items-center gap-4 p-4 border-b border-outline-variant/30 cursor-pointer transition-all duration-200',
        'hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/30',
        isSelected
          ? 'bg-primary-container/20 border-l-2 border-l-primary'
          : 'bg-surface-container-lowest',
      ].join(' ')}
      aria-selected={isSelected}
    >
      {/* Reference code */}
      <div className="flex-shrink-0 w-24">
        <span className="font-[Hanken_Grotesk] text-[12px] font-mono font-semibold text-primary">
          {reservation.referenceCode}
        </span>
      </div>

      {/* Guest name */}
      <div className="flex-1 min-w-0">
        <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface font-medium truncate block">
          {reservation.guestFullName}
        </span>
        <span className="font-[Hanken_Grotesk] text-[12px] text-on-surface-variant truncate block">
          {roomName}
        </span>
      </div>

      {/* Date range */}
      <div className="flex-shrink-0 hidden md:block text-right">
        <span className="font-[Hanken_Grotesk] text-[12px] text-on-surface whitespace-nowrap">
          {format(new Date(reservation.checkInDate), 'd MMM', { locale: dateLocale })}
          {' – '}
          {format(new Date(reservation.checkOutDate), 'd MMM', { locale: dateLocale })}
        </span>
        <span className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant block">
          {nights} {t('admin.reservations.nights')}
        </span>
      </div>

      {/* Total price */}
      <div className="flex-shrink-0 hidden sm:block w-20 text-right">
        <span className="font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface">
          ${Math.round(reservation.totalPrice)}
        </span>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0">
        <StatusBadge status={reservation.status as Status} />
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {transitions.map((tr) => (
          <button
            key={tr}
            onClick={(e) => {
              e.stopPropagation()
              onTransition(reservation._id, tr)
            }}
            title={t(`admin.reservations.action.${tr}`)}
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {TRANSITION_ICONS[tr]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
