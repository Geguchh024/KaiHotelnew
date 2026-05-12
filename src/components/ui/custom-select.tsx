import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface CustomSelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: string
  label?: string
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  label,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

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
          {icon && (
            <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
          )}
          <span
            className={cn(
              'font-[Hanken_Grotesk] text-[13px] leading-[1.5] flex-1',
              selectedOption ? 'text-on-surface' : 'text-outline',
            )}
          >
            {selectedOption?.label || placeholder}
          </span>
          <span
            className={cn(
              'material-symbols-outlined text-secondary text-[14px] transition-transform duration-200',
              open && 'rotate-180',
            )}
          >
            expand_more
          </span>
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface-container-lowest border border-outline-variant/30 shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value)
                    setOpen(false)
                  }
                }}
                className={cn(
                  'w-full text-left px-3 py-2 font-[Hanken_Grotesk] text-[12px] transition-colors',
                  option.value === value
                    ? 'bg-primary/5 text-primary font-semibold'
                    : 'text-on-surface hover:bg-surface-container',
                  option.disabled && 'text-outline/40 cursor-not-allowed hover:bg-transparent',
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.value === value && (
                    <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
