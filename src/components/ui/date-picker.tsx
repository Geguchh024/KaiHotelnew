import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { ka, enUS } from 'date-fns/locale'
import { Calendar } from './calendar'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'

interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  locale?: Locale
  icon?: string
  disabledDates?: Date[]
  minDate?: Date
  rangeStart?: Date | null
  rangeEnd?: Date | null
  label?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  locale = 'ka',
  icon = 'calendar_today',
  disabledDates = [],
  minDate,
  rangeStart,
  rangeEnd,
  label,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dateLocale = locale === 'ka' ? ka : enUS

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-1.5" ref={ref}>
      {label && (
        <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-2 w-full border-b border-outline py-2 text-left transition-colors hover:border-primary',
            open && 'border-primary',
          )}
        >
          <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
          <span
            className={cn(
              'font-[Hanken_Grotesk] text-[13px] leading-[1.5]',
              value ? 'text-on-surface' : 'text-outline',
            )}
          >
            {value ? format(value, 'd MMM, yyyy', { locale: dateLocale }) : placeholder}
          </span>
          <span className="material-symbols-outlined text-secondary text-[14px] ml-auto">
            expand_more
          </span>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            <Calendar
              selected={value}
              onSelect={(date) => {
                onChange(date)
                setOpen(false)
              }}
              locale={locale}
              disabledDates={disabledDates}
              minDate={minDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          </div>
        )}
      </div>
    </div>
  )
}
