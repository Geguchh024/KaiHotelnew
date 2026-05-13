import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

export function AdminHeader() {
  const { locale } = useI18n()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = now.toLocaleTimeString(locale === 'ka' ? 'ka-GE' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = now.toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="font-[EB_Garamond] text-[36px] md:text-[48px] leading-[1.2] text-primary mb-2">
          {locale === 'ka' ? 'გამარჯობა, ადმინისტრატორ' : 'Welcome back, Administrator'}
        </h2>
        <div className="flex items-center gap-4 text-secondary/80">
          <span className="font-[Hanken_Grotesk] text-[13px] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">schedule</span>
            <time>{timeStr}</time>
          </span>
          <span className="w-1 h-1 bg-outline-variant rounded-full" aria-hidden="true" />
          <span className="font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.1em]">
            <time dateTime={now.toISOString()}>{dateStr}</time>
          </span>
        </div>
      </div>
    </header>
  )
}

