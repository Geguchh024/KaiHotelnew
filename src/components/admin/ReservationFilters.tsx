import { useI18n } from '@/lib/i18n'
import { CustomSelect } from '@/components/ui/custom-select'
import { DatePicker } from '@/components/ui/date-picker'
import type { ReservationFilterCriteria } from '../../utils/filterReservations'
import type { Doc } from '../../../convex/_generated/dataModel'
import type { Locale } from '@/lib/i18n'

interface ReservationFiltersProps {
  criteria: ReservationFilterCriteria
  onChange: (criteria: ReservationFilterCriteria) => void
  rooms: Doc<"rooms">[]
}

const STATUS_OPTIONS = [
  'all',
  'pending',
  'confirmed',
  'checkedIn',
  'checkedOut',
  'cancelled',
  'noShow',
] as const

export function ReservationFilters({ criteria, onChange, rooms }: ReservationFiltersProps) {
  const { locale, t } = useI18n()

  const statusOptions = STATUS_OPTIONS.map((s) => ({
    value: s,
    label: s === 'all' ? t('admin.reservations.filter.all') : t(`admin.reservations.status.${s}`),
  }))

  const roomOptions = [
    { value: '__all__', label: t('admin.reservations.filter.all') },
    ...rooms.map((r) => ({
      value: r._id,
      label: locale === 'ka' ? r.nameKa : r.nameEn,
    })),
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Status filter */}
      <CustomSelect
        value={criteria.status}
        onChange={(val) => onChange({ ...criteria, status: val as ReservationFilterCriteria['status'] })}
        icon="filter_list"
        label={t('admin.reservations.filter.status')}
        options={statusOptions}
      />

      {/* Room filter */}
      <CustomSelect
        value={criteria.roomId ?? '__all__'}
        onChange={(val) => onChange({ ...criteria, roomId: val === '__all__' ? null : val })}
        icon="bed"
        label={t('admin.reservations.filter.room')}
        options={roomOptions}
      />

      {/* Check-in from */}
      <DatePicker
        value={criteria.checkInFrom ? new Date(criteria.checkInFrom) : null}
        onChange={(date) => onChange({ ...criteria, checkInFrom: date.getTime() })}
        placeholder={t('admin.reservations.filter.checkInFrom')}
        locale={locale as Locale}
        icon="calendar_today"
        label={t('admin.reservations.filter.checkInFrom')}
      />

      {/* Check-in to */}
      <DatePicker
        value={criteria.checkInTo ? new Date(criteria.checkInTo) : null}
        onChange={(date) => onChange({ ...criteria, checkInTo: date.getTime() })}
        placeholder={t('admin.reservations.filter.checkInTo')}
        locale={locale as Locale}
        icon="calendar_today"
        label={t('admin.reservations.filter.checkInTo')}
      />

      {/* Free-text search */}
      <div className="space-y-1.5">
        <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block">
          {t('admin.reservations.filter.search')}
        </label>
        <div className="relative">
          <span className="material-symbols-outlined text-primary text-[16px] absolute left-0 top-1/2 -translate-y-1/2">
            search
          </span>
          <input
            type="text"
            value={criteria.search}
            onChange={(e) => onChange({ ...criteria, search: e.target.value })}
            placeholder={t('admin.reservations.filter.search')}
            className="w-full pl-6 border-b border-outline py-2 font-[Hanken_Grotesk] text-[13px] text-on-surface bg-transparent focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  )
}
