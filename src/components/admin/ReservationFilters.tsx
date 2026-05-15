import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)

  // Count active filters (non-default values)
  const activeCount = [
    criteria.status !== 'all',
    criteria.roomId !== null,
    criteria.checkInFrom !== null,
    criteria.checkInTo !== null,
    criteria.search !== '',
  ].filter(Boolean).length

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

  const handleClear = () => {
    onChange({
      status: 'all',
      roomId: null,
      checkInFrom: null,
      checkInTo: null,
      search: '',
    })
  }

  return (
    <div className="mb-6">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant/40 hover:border-primary/40 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">filter_list</span>
        {locale === 'ka' ? 'ფილტრები' : 'Filters'}
        {activeCount > 0 && (
          <span className="bg-primary text-on-primary text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {activeCount}
          </span>
        )}
        <span className="material-symbols-outlined text-[16px] ml-1 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>

      {/* Collapsible filter panel */}
      {isOpen && (
        <div className="mt-4 p-4 sm:p-5 border border-outline-variant/30 bg-surface-container-low rounded-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

          {/* Clear filters */}
          {activeCount > 0 && (
            <div className="mt-4 pt-3 border-t border-outline-variant/20">
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 font-[Hanken_Grotesk] text-[11px] font-semibold text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                {locale === 'ka' ? 'ფილტრების გასუფთავება' : 'Clear all filters'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
