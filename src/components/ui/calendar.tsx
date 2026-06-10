import { useState } from 'react'
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
  isAfter,
  startOfDay,
} from 'date-fns'
import { ka, enUS, ru } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'

interface CalendarProps {
  selected?: Date | null
  onSelect: (date: Date) => void
  locale?: Locale
  disabledDates?: Date[]
  minDate?: Date
  rangeStart?: Date | null
  rangeEnd?: Date | null
}

export function Calendar({
  selected,
  onSelect,
  locale = 'ka',
  disabledDates = [],
  minDate,
  rangeStart,
  rangeEnd,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const dateLocale = locale === 'ka' ? ka : locale === 'ru' ? ru : enUS

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const today = startOfDay(new Date())

  const days: Date[] = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = locale === 'ka'
    ? ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი']
    : locale === 'ru'
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const isDisabled = (date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true
    if (isBefore(date, today)) return true
    return disabledDates.some((d) => isSameDay(d, date))
  }

  const isInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false
    return isAfter(date, rangeStart) && isBefore(date, rangeEnd)
  }

  const isCancelled = (date: Date) => {
    return disabledDates.some((d) => isSameDay(d, date))
  }

  return (
    <div className="w-[280px] bg-surface-container-lowest border border-outline-variant/30 shadow-lg p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-7 h-7 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container rounded-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        </button>
        <span className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-7 h-7 flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container rounded-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((wd) => (
          <div
            key={wd}
            className="text-center font-[Hanken_Grotesk] text-[10px] font-semibold text-on-surface-variant uppercase py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const disabled = isDisabled(d)
          const isSelected = selected && isSameDay(d, selected)
          const isToday = isSameDay(d, today)
          const inCurrentMonth = isSameMonth(d, currentMonth)
          const inRange = isInRange(d)
          const cancelled = isCancelled(d)
          const isRangeStart = rangeStart && isSameDay(d, rangeStart)
          const isRangeEnd = rangeEnd && isSameDay(d, rangeEnd)

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(d)}
              className={cn(
                'relative w-9 h-9 flex items-center justify-center font-[Hanken_Grotesk] text-[12px] transition-all rounded-sm',
                !inCurrentMonth && 'text-outline/40',
                inCurrentMonth && !disabled && 'text-on-surface hover:bg-primary/10',
                disabled && !cancelled && 'text-outline/30 cursor-not-allowed',
                cancelled && 'text-error/60 cursor-not-allowed',
                isToday && !isSelected && 'font-bold ring-1 ring-primary/30',
                isSelected && 'bg-primary text-on-primary font-semibold',
                isRangeStart && 'bg-primary text-on-primary font-semibold rounded-r-none',
                isRangeEnd && 'bg-primary text-on-primary font-semibold rounded-l-none',
                inRange && !isRangeStart && !isRangeEnd && 'bg-primary/10 rounded-none',
              )}
            >
              {format(d, 'd')}
              {cancelled && inCurrentMonth && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-5 h-[1.5px] bg-error/50 rotate-[-45deg] absolute"></span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-primary rounded-sm"></span>
          <span className="font-[Hanken_Grotesk] text-[10px] text-secondary">
            {locale === 'ka' ? 'არჩეული' : locale === 'ru' ? 'Выбрано' : 'Selected'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative w-3 h-3 border border-error/50 rounded-sm flex items-center justify-center">
            <span className="w-2 h-[1px] bg-error/50 rotate-[-45deg] absolute"></span>
          </span>
          <span className="font-[Hanken_Grotesk] text-[10px] text-secondary">
            {locale === 'ka' ? 'მიუწვდომელი' : locale === 'ru' ? 'Недоступно' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  )
}
