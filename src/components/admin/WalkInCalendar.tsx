import { useMemo, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ka, enUS, ru } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'

const MS_PER_DAY = 86_400_000

interface WalkInCalendarProps {
  /** Selected check-in date (UTC midnight ms). */
  checkIn: number | null
  /** Selected check-out date (UTC midnight ms). */
  checkOut: number | null
  onChange: (next: { checkIn: number | null; checkOut: number | null }) => void
  /**
   * Union of UTC-midnight ms timestamps that are blocked (any selected room
   * is unavailable on that date). Renders with a strikethrough-cancelled visual.
   */
  blocked: ReadonlySet<number>
  locale?: Locale
  /** Allow picking dates in the past (default: false — admins can pick today onward). */
  allowPast?: boolean
}

/**
 * Premium two-month admin calendar with strikethrough "cancelled/booked" days.
 * Click once to set check-in; click again to set check-out. Clicking before
 * the current check-in resets the range. Hover preview shows the prospective
 * range while the user is mid-selection.
 */
export function WalkInCalendar({
  checkIn,
  checkOut,
  onChange,
  blocked,
  locale = 'en',
  allowPast = false,
}: WalkInCalendarProps) {
  const dateLocale = locale === 'ka' ? ka : locale === 'ru' ? ru : enUS
  const today = startOfDay(new Date())
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    if (checkIn) return startOfMonth(new Date(checkIn))
    return startOfMonth(today)
  })
  const [hover, setHover] = useState<Date | null>(null)

  // Build the days for the visible month + the next month side-by-side.
  const months = useMemo(() => [viewMonth, addMonths(viewMonth, 1)], [viewMonth])

  const weekDays =
    locale === 'ka'
      ? ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი']
      : locale === 'ru'
      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const ciMs = checkIn
  const coMs = checkOut
  const ciDate = ciMs ? new Date(ciMs) : null
  const coDate = coMs ? new Date(coMs) : null

  const isBlocked = (utcMs: number) => blocked.has(utcMs)

  // A range is invalid (and we surface a hint) if it would cross a blocked day.
  const rangeCrossesBlocked = (a: number, b: number) => {
    const start = Math.min(a, b)
    const end = Math.max(a, b)
    for (let d = start; d < end; d += MS_PER_DAY) {
      if (blocked.has(d)) return true
    }
    return false
  }

  const utcMidnightOf = (d: Date) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())

  function handleClick(d: Date) {
    if (!allowPast && isBefore(d, today)) return
    const ms = utcMidnightOf(d)

    // No selection yet, or both already set → start a new range from this day.
    if (!ciMs || (ciMs && coMs)) {
      onChange({ checkIn: ms, checkOut: null })
      return
    }
    // Have check-in only.
    if (ms === ciMs) {
      // Clicking the same start clears it.
      onChange({ checkIn: null, checkOut: null })
      return
    }
    if (ms < ciMs) {
      // Earlier than check-in → restart from this earlier date.
      onChange({ checkIn: ms, checkOut: null })
      return
    }
    // Refuse if the range would cross a blocked night.
    if (rangeCrossesBlocked(ciMs, ms)) {
      // Reset selection to this day instead — clearer than silently rejecting.
      onChange({ checkIn: ms, checkOut: null })
      return
    }
    onChange({ checkIn: ciMs, checkOut: ms })
  }

  // Visual range bounds (use hover for preview when only check-in is set).
  const previewEndMs =
    coMs ?? (ciMs && hover ? utcMidnightOf(hover) : null)
  const inRange = (d: Date) => {
    if (!ciMs || !previewEndMs) return false
    const ms = utcMidnightOf(d)
    const lo = Math.min(ciMs, previewEndMs)
    const hi = Math.max(ciMs, previewEndMs)
    return ms > lo && ms < hi
  }
  const isRangeStart = (d: Date) => ciMs !== null && utcMidnightOf(d) === ciMs
  const isRangeEnd = (d: Date) => coMs !== null && utcMidnightOf(d) === coMs

  const nights =
    ciMs && coMs ? Math.round((coMs - ciMs) / MS_PER_DAY) : 0

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container-low">
        <button
          type="button"
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
          aria-label="Previous month"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        <div className="flex items-center gap-6">
          {months.map((m) => (
            <span
              key={m.toISOString()}
              className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary capitalize"
            >
              {format(m, 'LLLL yyyy', { locale: dateLocale })}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
          aria-label="Next month"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      {/* Two months side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/15">
        {months.map((m) => (
          <MonthGrid
            key={m.toISOString()}
            monthDate={m}
            weekDays={weekDays}
            today={today}
            hover={hover}
            setHover={setHover}
            allowPast={allowPast}
            isBlocked={(utcMs) => isBlocked(utcMs)}
            isRangeStart={isRangeStart}
            isRangeEnd={isRangeEnd}
            inRange={inRange}
            onClick={handleClick}
            utcMidnightOf={utcMidnightOf}
            locale={locale}
          />
        ))}
      </div>

      {/* Footer: status + legend */}
      <div className="px-4 py-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low">
        <div className="font-[Hanken_Grotesk] text-[12px] text-on-surface-variant">
          {ciDate && coDate ? (
            <span>
              <span className="font-semibold text-primary">
                {format(ciDate, 'd MMM', { locale: dateLocale })}
              </span>{' '}
              –{' '}
              <span className="font-semibold text-primary">
                {format(coDate, 'd MMM yyyy', { locale: dateLocale })}
              </span>
              <span className="ml-2 text-secondary">
                · {nights} {locale === 'ka' ? 'ღამე' : locale === 'ru' ? 'ночей' : nights === 1 ? 'night' : 'nights'}
              </span>
            </span>
          ) : ciDate ? (
            <span>
              {locale === 'ka' ? 'აირჩიეთ გასვლის თარიღი' : locale === 'ru' ? 'Выберите дату выезда' : 'Pick a check-out date'}
            </span>
          ) : (
            <span>
              {locale === 'ka' ? 'აირჩიეთ შესვლის თარიღი' : locale === 'ru' ? 'Выберите дату заезда' : 'Pick a check-in date'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-primary rounded-sm" aria-hidden="true"></span>
            <span className="font-[Hanken_Grotesk] text-[10px] text-secondary">
              {locale === 'ka' ? 'არჩეული' : locale === 'ru' ? 'Выбрано' : 'Selected'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-primary/15 rounded-sm" aria-hidden="true"></span>
            <span className="font-[Hanken_Grotesk] text-[10px] text-secondary">
              {locale === 'ka' ? 'დიაპაზონი' : locale === 'ru' ? 'Диапазон' : 'Range'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative w-3 h-3 border border-error/50 rounded-sm flex items-center justify-center" aria-hidden="true">
              <span className="w-2 h-px bg-error/60 rotate-[-45deg] absolute"></span>
            </span>
            <span className="font-[Hanken_Grotesk] text-[10px] text-secondary">
              {locale === 'ka' ? 'დაკავებული' : locale === 'ru' ? 'Занято' : 'Booked'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MonthGridProps {
  monthDate: Date
  weekDays: string[]
  today: Date
  hover: Date | null
  setHover: (d: Date | null) => void
  allowPast: boolean
  isBlocked: (utcMs: number) => boolean
  isRangeStart: (d: Date) => boolean
  isRangeEnd: (d: Date) => boolean
  inRange: (d: Date) => boolean
  onClick: (d: Date) => void
  utcMidnightOf: (d: Date) => number
  locale: Locale
}

function MonthGrid({
  monthDate,
  weekDays,
  today,
  hover,
  setHover,
  allowPast,
  isBlocked,
  isRangeStart,
  isRangeEnd,
  inRange,
  onClick,
  utcMidnightOf,
  locale,
}: MonthGridProps) {
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days: Date[] = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((wd) => (
          <div
            key={wd}
            className="text-center font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant py-1"
          >
            {wd}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((d) => {
          const inCurrentMonth = isSameMonth(d, monthDate)
          const past = !allowPast && isBefore(d, today)
          const ms = utcMidnightOf(d)
          const blocked = isBlocked(ms)
          const isToday = isSameDay(d, today)
          const isStart = isRangeStart(d)
          const isEnd = isRangeEnd(d)
          const within = inRange(d)
          const disabled = past || (blocked && !isStart && !isEnd)

          // Days with no current-month presence appear as faded ghosts so the
          // grid keeps its rhythm without distracting from the active month.
          if (!inCurrentMonth) {
            return (
              <div
                key={d.toISOString()}
                className="h-10 flex items-center justify-center font-[Hanken_Grotesk] text-[12px] text-outline/30"
              >
                {format(d, 'd')}
              </div>
            )
          }

          // Pad differently within the range so the highlight forms a continuous bar.
          const inRangeBg = within
            ? 'bg-primary/15'
            : ''

          return (
            <div
              key={d.toISOString()}
              className={cn('relative h-10 flex items-center justify-center', inRangeBg)}
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onClick(d)}
                className={cn(
                  'relative w-9 h-9 flex items-center justify-center font-[Hanken_Grotesk] text-[12px] rounded-full transition-all',
                  // Default state
                  !disabled && !isStart && !isEnd && 'text-on-surface hover:bg-primary/10',
                  // Past dates
                  past && 'text-outline/30 cursor-not-allowed',
                  // Blocked dates (booked) — strikethrough cancelled visual
                  blocked && !isStart && !isEnd && 'text-error/50 cursor-not-allowed',
                  // Today (when not start/end)
                  isToday && !isStart && !isEnd && 'ring-1 ring-primary/40 font-semibold',
                  // Range endpoints
                  (isStart || isEnd) &&
                    'bg-primary text-on-primary font-semibold shadow-sm',
                )}
                aria-disabled={disabled}
                aria-label={format(d, 'PPP')}
                title={
                  blocked
                    ? locale === 'ka' ? 'დაკავებული' : locale === 'ru' ? 'Забронировано' : 'Booked'
                    : past
                    ? locale === 'ka' ? 'წარსული' : locale === 'ru' ? 'Прошедшая дата' : 'Past date'
                    : undefined
                }
              >
                {format(d, 'd')}
                {/* Strikethrough overlay for blocked days */}
                {blocked && !isStart && !isEnd && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="w-6 h-px bg-error/60 rotate-[-22deg]"></span>
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
      {/* Quick day-count badge if hover-previewing the range */}
    </div>
  )
}

// Small utility consumers may want to convert a Date to a UTC-midnight ms value.
export const utcMidnight = (d: Date) =>
  Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
