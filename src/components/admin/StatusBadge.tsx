import { useI18n } from '@/lib/i18n'
import type { Status } from '../../../convex/availability'

interface StatusBadgeProps {
  status: Status
}

const STATUS_STYLES: Record<Status, string> = {
  pending: 'bg-on-surface/10 text-on-surface-variant',
  confirmed: 'bg-primary-container text-on-primary-container',
  checkedIn: 'bg-primary-container text-on-primary-container',
  checkedOut: 'bg-green-100 text-green-800',
  cancelled: 'bg-error-container text-on-error-container',
  noShow: 'bg-amber-100 text-amber-800',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n()

  return (
    <span
      className={[
        'inline-block font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full whitespace-nowrap',
        STATUS_STYLES[status],
      ].join(' ')}
    >
      {t(`admin.reservations.status.${status}`)}
    </span>
  )
}
