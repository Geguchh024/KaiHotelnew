import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ReservationDetailPanel } from './ReservationDetailPanel'
import { useIsMobile } from '@/hooks/useMediaQuery'
import type { Reservation } from './ReservationRow'
import type { Doc } from '../../../convex/_generated/dataModel'

const MS_PER_DAY = 86_400_000

// ─── Shared ────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  pending:    'rgba(180,140,0,0.7)',
  confirmed:  'rgba(60,100,200,0.7)',
  checkedIn:  'rgba(36,54,36,0.85)',
  checkedOut: 'rgba(120,130,140,0.6)',
  cancelled:  'rgba(186,26,26,0.65)',
  noShow:     'rgba(200,100,30,0.65)',
}

function utcDay(y: number, m: number, d: number) {
  return Date.UTC(y, m, d)
}

interface Props {
  rooms: Doc<'rooms'>[]
}

/**
 * Top-level timeline component. Picks the right presentation per viewport:
 *   - Mobile: vertical agenda grouped by day (one row per booking).
 *   - Tablet+: horizontal Gantt grid (one row per room).
 *
 * Both presentations share the same data fetch and the same `ReservationDetailPanel`
 * for selection so behavior is identical across breakpoints.
 */
export function ReservationTimelineView({ rooms }: Props) {
  const { locale } = useI18n()
  const { sessionToken } = useAdminAuth()
  const isMobile = useIsMobile()
  const [selected, setSelected] = useState<Reservation | null>(null)

  const allReservations = useQuery(
    api.reservations.listAll,
    sessionToken ? { sessionToken } : 'skip',
  ) as Reservation[] | undefined

  const roomLabel = useCallback(
    (r: Doc<'rooms'>) => (locale === 'ka' ? r.nameKa : r.nameEn),
    [locale],
  )
  const roomById = useMemo(() => {
    const m: Record<string, string> = {}
    for (const r of rooms) m[r._id] = roomLabel(r)
    return m
  }, [rooms, roomLabel])

  const isLoading = allReservations === undefined

  return (
    <div className="space-y-3 sm:space-y-4">
      <Legend locale={locale} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 border border-outline-variant/30 rounded-sm bg-surface-container-lowest">
          <span className="material-symbols-outlined text-primary text-[28px] animate-spin">
            progress_activity
          </span>
        </div>
      ) : isMobile ? (
        <MobileAgenda
          reservations={allReservations}
          rooms={rooms}
          roomById={roomById}
          selected={selected}
          onSelect={setSelected}
          locale={locale}
        />
      ) : (
        <DesktopGantt
          reservations={allReservations}
          rooms={rooms}
          roomLabel={roomLabel}
          selected={selected}
          onSelect={setSelected}
          locale={locale}
        />
      )}

      {selected && (
        <ReservationDetailPanel
          reservation={selected}
          roomName={roomById[selected.roomId] ?? '—'}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

// ─── Legend ────────────────────────────────────────────────────────────────

function Legend({ locale }: { locale: 'ka' | 'en' }) {
  const items = [
    { key: 'pending', label: locale === 'ka' ? 'მოლოდინში' : 'Pending' },
    { key: 'confirmed', label: locale === 'ka' ? 'დადასტურებული' : 'Confirmed' },
    { key: 'checkedIn', label: locale === 'ka' ? 'შესული' : 'Checked In' },
    { key: 'checkedOut', label: locale === 'ka' ? 'გასული' : 'Checked Out' },
    { key: 'cancelled', label: locale === 'ka' ? 'გაუქმებული' : 'Cancelled' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-5">
      {items.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: STATUS_COLOR[key] }}
          />
          <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Mobile agenda ─────────────────────────────────────────────────────────

interface AgendaProps {
  reservations: Reservation[]
  rooms: Doc<'rooms'>[]
  roomById: Record<string, string>
  selected: Reservation | null
  onSelect: (r: Reservation | null) => void
  locale: 'ka' | 'en'
}

type Bucket = 'today' | 'tomorrow' | 'thisWeek' | 'later' | 'past'

const BUCKET_ORDER: Bucket[] = ['today', 'tomorrow', 'thisWeek', 'later', 'past']

function bucketLabel(b: Bucket, locale: 'ka' | 'en') {
  if (locale === 'ka') {
    return {
      today: 'დღეს',
      tomorrow: 'ხვალ',
      thisWeek: 'ამ კვირაში',
      later: 'მოგვიანებით',
      past: 'წარსული',
    }[b]
  }
  return {
    today: 'Today',
    tomorrow: 'Tomorrow',
    thisWeek: 'This week',
    later: 'Upcoming',
    past: 'Past',
  }[b]
}

function bucketFor(reservation: Reservation, todayMs: number): Bucket {
  // Bucket by check-in date for upcoming arrivals; treat in-progress and
  // already-departed reservations as "past" for sorting.
  const ci = reservation.checkInDate
  const co = reservation.checkOutDate
  if (co <= todayMs) return 'past'
  if (ci === todayMs) return 'today'
  if (ci === todayMs + MS_PER_DAY) return 'tomorrow'
  if (ci > todayMs && ci <= todayMs + 7 * MS_PER_DAY) return 'thisWeek'
  if (ci > todayMs) return 'later'
  // Started before today but not yet checked out → in progress, show under today
  return 'today'
}

function formatDateShort(ms: number, locale: 'ka' | 'en') {
  return new Date(ms).toLocaleDateString(
    locale === 'ka' ? 'ka-GE' : 'en-US',
    { month: 'short', day: 'numeric', timeZone: 'UTC' },
  )
}

function formatRange(ci: number, co: number, locale: 'ka' | 'en') {
  return `${formatDateShort(ci, locale)} – ${formatDateShort(co, locale)}`
}

function nightsBetween(ci: number, co: number) {
  return Math.round((co - ci) / MS_PER_DAY)
}

function MobileAgenda({
  reservations,
  rooms: _rooms,
  roomById,
  selected,
  onSelect,
  locale,
}: AgendaProps) {
  const [filterRoomId, setFilterRoomId] = useState<string | 'all'>('all')
  const [showPast, setShowPast] = useState(false)

  const now = new Date()
  const todayMs = utcDay(now.getFullYear(), now.getMonth(), now.getDate())

  // Filter out cancelled+noShow by default — they're noise on the agenda.
  // Admin can still find them in the Archive list.
  const visibleStatuses = new Set([
    'pending',
    'confirmed',
    'checkedIn',
    'checkedOut',
  ])

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (!visibleStatuses.has(r.status)) return false
      if (filterRoomId !== 'all' && r.roomId !== filterRoomId) return false
      return true
    })
  }, [reservations, filterRoomId])

  // Group by bucket and sort within each bucket by check-in date asc.
  const grouped = useMemo(() => {
    const out: Record<Bucket, Reservation[]> = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      past: [],
    }
    for (const r of filtered) {
      out[bucketFor(r, todayMs)].push(r)
    }
    for (const b of BUCKET_ORDER) {
      out[b].sort((a, b) => a.checkInDate - b.checkInDate)
    }
    return out
  }, [filtered, todayMs])

  const totalUpcoming =
    grouped.today.length +
    grouped.tomorrow.length +
    grouped.thisWeek.length +
    grouped.later.length

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1">
        <FilterPill
          active={filterRoomId === 'all'}
          onClick={() => setFilterRoomId('all')}
        >
          {locale === 'ka' ? 'ყველა ნომერი' : 'All rooms'}
        </FilterPill>
        {Object.keys(roomById).map((id) => (
          <FilterPill
            key={id}
            active={filterRoomId === id}
            onClick={() => setFilterRoomId(id)}
          >
            {roomById[id]}
          </FilterPill>
        ))}
      </div>

      {totalUpcoming === 0 && grouped.past.length === 0 && (
        <div className="text-center py-12 border border-outline-variant/30 rounded-sm bg-surface-container-lowest">
          <span className="material-symbols-outlined text-[36px] text-secondary/40 block mb-2">
            event_busy
          </span>
          <p className="font-[Hanken_Grotesk] text-[12px] text-on-surface-variant">
            {locale === 'ka' ? 'ჯავშნები არ არის' : 'No reservations to show'}
          </p>
        </div>
      )}

      {/* Buckets — Today / Tomorrow / This week / Later */}
      <div className="space-y-4">
        {(['today', 'tomorrow', 'thisWeek', 'later'] as const).map((b) => {
          const list = grouped[b]
          if (list.length === 0) return null
          return (
            <BucketSection
              key={b}
              title={bucketLabel(b, locale)}
              count={list.length}
              tone={b === 'today' ? 'accent' : b === 'tomorrow' ? 'soft' : 'plain'}
            >
              {list.map((r) => (
                <AgendaCard
                  key={r._id}
                  reservation={r}
                  roomName={roomById[r.roomId] ?? '—'}
                  isSelected={selected?._id === r._id}
                  onClick={() =>
                    onSelect(selected?._id === r._id ? null : r)
                  }
                  todayMs={todayMs}
                  locale={locale}
                />
              ))}
            </BucketSection>
          )
        })}
      </div>

      {/* Past — collapsible */}
      {grouped.past.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowPast((v) => !v)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-sm border border-outline-variant/30 bg-surface-container-low hover:border-primary/30 transition-colors"
          >
            <span className="flex items-center gap-2 font-[Hanken_Grotesk] text-[12px] font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">history</span>
              {bucketLabel('past', locale)}
              <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {grouped.past.length}
              </span>
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform" style={{ transform: showPast ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          {showPast && (
            <div className="mt-2 space-y-2">
              {grouped.past.slice(0, 30).map((r) => (
                <AgendaCard
                  key={r._id}
                  reservation={r}
                  roomName={roomById[r.roomId] ?? '—'}
                  isSelected={selected?._id === r._id}
                  onClick={() =>
                    onSelect(selected?._id === r._id ? null : r)
                  }
                  todayMs={todayMs}
                  locale={locale}
                  muted
                />
              ))}
              {grouped.past.length > 30 && (
                <p className="font-[Hanken_Grotesk] text-[10px] text-on-surface-variant/70 text-center pt-1">
                  {locale === 'ka'
                    ? `+ ${grouped.past.length - 30} მეტი — სრული სია არქივში`
                    : `+ ${grouped.past.length - 30} more — see Archive for full history`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'shrink-0 px-3 py-1.5 rounded-full font-[Hanken_Grotesk] text-[11px] font-semibold whitespace-nowrap transition-colors border',
        active
          ? 'bg-primary text-on-primary border-primary'
          : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-primary/40 hover:text-primary',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function BucketSection({
  title,
  count,
  tone,
  children,
}: {
  title: string
  count: number
  tone: 'accent' | 'soft' | 'plain'
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <h4
          className={[
            'font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.08em]',
            tone === 'accent'
              ? 'text-primary'
              : tone === 'soft'
              ? 'text-on-surface'
              : 'text-on-surface-variant',
          ].join(' ')}
        >
          {title}
        </h4>
        <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full px-1.5 py-0.5">
          {count}
        </span>
        <div className="flex-1 h-px bg-outline-variant/30" />
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function AgendaCard({
  reservation,
  roomName,
  isSelected,
  onClick,
  todayMs,
  locale,
  muted,
}: {
  reservation: Reservation
  roomName: string
  isSelected: boolean
  onClick: () => void
  todayMs: number
  locale: 'ka' | 'en'
  muted?: boolean
}) {
  const r = reservation
  const nights = nightsBetween(r.checkInDate, r.checkOutDate)
  const inProgress = r.checkInDate <= todayMs && r.checkOutDate > todayMs
  const startsToday = r.checkInDate === todayMs

  // Status pill
  const statusLabels: Record<string, { ka: string; en: string }> = {
    pending: { ka: 'მოლოდინში', en: 'Pending' },
    confirmed: { ka: 'დადასტ.', en: 'Confirmed' },
    checkedIn: { ka: 'შესული', en: 'Checked in' },
    checkedOut: { ka: 'გასული', en: 'Checked out' },
    cancelled: { ka: 'გაუქმ.', en: 'Cancelled' },
    noShow: { ka: 'არ მოვიდა', en: 'No-show' },
  }
  const statusLabel = statusLabels[r.status]?.[locale] ?? r.status

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={[
        'w-full text-left bg-surface-container-lowest border rounded-sm p-3 transition-all',
        isSelected
          ? 'border-primary ring-1 ring-primary/20'
          : 'border-outline-variant/30 hover:border-primary/30',
        muted && 'opacity-70',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start gap-3">
        {/* Status dot + date column */}
        <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0 w-12">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: STATUS_COLOR[r.status] }}
            aria-hidden="true"
          />
          <span className="font-[Hanken_Grotesk] text-[10px] text-on-surface-variant text-center leading-tight">
            {formatDateShort(r.checkInDate, locale)}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <span className="font-[Hanken_Grotesk] text-[14px] font-semibold text-on-surface truncate">
              {r.guestFullName}
            </span>
            <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary shrink-0">
              ${Math.round(r.totalPrice)}
            </span>
          </div>
          <div className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant truncate">
            {roomName} · {formatRange(r.checkInDate, r.checkOutDate, locale)} ·{' '}
            {nights} {locale === 'ka' ? 'ღამე' : nights === 1 ? 'night' : 'nights'}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span
              className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded-sm"
              style={{
                background: `color-mix(in srgb, ${STATUS_COLOR[r.status]} 15%, transparent)`,
                color: STATUS_COLOR[r.status],
              }}
            >
              {statusLabel}
            </span>
            {startsToday && !inProgress && (
              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                {locale === 'ka' ? 'დღეს ჩადის' : 'Arriving today'}
              </span>
            )}
            {inProgress && (
              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                {locale === 'ka' ? 'მიმდინარე' : 'In stay'}
              </span>
            )}
            <span className="font-[Hanken_Grotesk] text-[10px] text-on-surface-variant/70 ml-auto font-mono">
              {r.referenceCode}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── Desktop Gantt ─────────────────────────────────────────────────────────

const CELL_W = 38
const ROW_H = 44
const LABEL_W = 130

function generateDays(s: number, e: number) {
  const days: number[] = []
  for (let c = s; c <= e; c += MS_PER_DAY) days.push(c)
  return days
}
function fmtDate(ms: number) {
  const d = new Date(ms)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`
}
function fmtDow(ms: number) {
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(ms).getUTCDay()]
}
function isWeekend(ms: number) {
  const d = new Date(ms).getUTCDay()
  return d === 0 || d === 6
}
function isMonthStart(ms: number) {
  return new Date(ms).getUTCDate() === 1
}
function fmtMonth(ms: number) {
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const RES_COLORS = [
  { bg: 'rgba(36,54,36,0.07)',   accent: 'rgba(36,54,36,0.35)' },
  { bg: 'rgba(180,140,80,0.09)', accent: 'rgba(180,140,80,0.45)' },
  { bg: 'rgba(80,110,180,0.08)', accent: 'rgba(80,110,180,0.40)' },
  { bg: 'rgba(160,80,120,0.08)', accent: 'rgba(160,80,120,0.38)' },
  { bg: 'rgba(90,80,160,0.08)',  accent: 'rgba(90,80,160,0.38)' },
]

interface GanttProps {
  reservations: Reservation[]
  rooms: Doc<'rooms'>[]
  roomLabel: (r: Doc<'rooms'>) => string
  selected: Reservation | null
  onSelect: (r: Reservation | null) => void
  locale: 'ka' | 'en'
}

function DesktopGantt({
  reservations,
  rooms,
  roomLabel,
  selected,
  onSelect,
  locale,
}: GanttProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayColRef = useRef<HTMLTableCellElement>(null)

  const now = new Date()
  const todayMs = utcDay(now.getFullYear(), now.getMonth(), now.getDate())
  const startMs = todayMs - 42 * MS_PER_DAY
  const endMs = todayMs + 98 * MS_PER_DAY
  const days = useMemo(() => generateDays(startMs, endMs), [startMs, endMs])

  const resByRoom = useMemo(() => {
    const out: Record<string, Reservation[]> = {}
    for (const r of rooms) out[r._id] = []
    for (const res of reservations) {
      if (out[res.roomId]) out[res.roomId].push(res)
    }
    for (const id in out) out[id].sort((a, b) => a.checkInDate - b.checkInDate)
    return out
  }, [rooms, reservations])

  const monthGroups = useMemo(() => {
    const out: { label: string; count: number }[] = []
    for (const ms of days) {
      const label = fmtMonth(ms)
      if (!out.length || out[out.length - 1].label !== label)
        out.push({ label, count: 1 })
      else out[out.length - 1].count++
    }
    return out
  }, [days])

  const scrollToToday = useCallback(() => {
    if (!scrollRef.current || !todayColRef.current) return
    const col = todayColRef.current
    const container = scrollRef.current
    container.scrollTo({
      left: Math.max(0, col.offsetLeft - container.clientWidth / 2 + CELL_W / 2),
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    if (!scrollRef.current || !todayColRef.current) return
    const col = todayColRef.current
    const container = scrollRef.current
    container.scrollLeft = Math.max(
      0,
      col.offsetLeft - container.clientWidth / 2 + CELL_W / 2,
    )
  }, [reservations])

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={scrollToToday}
          className="flex items-center gap-1 px-2.5 py-1.5 border border-outline-variant/40 hover:border-primary/40 rounded-full font-[Hanken_Grotesk] text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
          aria-label={locale === 'ka' ? 'დღევანდელ დღემდე' : 'Jump to today'}
        >
          <span className="material-symbols-outlined text-[14px]">today</span>
          {locale === 'ka' ? 'დღეს' : 'Today'}
        </button>
      </div>

      <div className="border border-outline-variant/30 rounded-sm bg-surface-container-lowest overflow-hidden">
        <div className="flex" style={{ maxHeight: '62vh' }}>
          {/* Sticky room labels */}
          <div
            className="flex-shrink-0 border-r border-outline-variant/20 z-10"
            style={{ width: LABEL_W }}
          >
            <div
              className="border-b border-outline-variant/20 bg-surface-container-low flex items-end px-3 pb-2"
              style={{ height: ROW_H + 10 }}
            >
              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.06em] text-on-surface-variant">
                {locale === 'ka' ? 'ოთახი' : 'Room'}
              </span>
            </div>
            {rooms.map((room, idx) => (
              <div
                key={room._id}
                className="flex items-center px-3 border-b border-outline-variant/15"
                style={{
                  height: ROW_H,
                  background:
                    idx % 2 === 0
                      ? 'var(--color-surface-container-lowest)'
                      : 'var(--color-surface-container-low)',
                }}
              >
                <span className="font-[Hanken_Grotesk] text-[11px] font-medium text-on-surface leading-tight truncate">
                  {roomLabel(room)}
                </span>
              </div>
            ))}
          </div>

          {/* Scrollable grid */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto overflow-y-auto"
            style={{ minWidth: 0 }}
          >
            <table
              className="border-collapse"
              style={{ width: days.length * CELL_W, tableLayout: 'fixed' }}
            >
              <colgroup>
                {days.map((ms) => (
                  <col key={ms} style={{ width: CELL_W }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr>
                  {monthGroups.map((g, i) => (
                    <th
                      key={i}
                      colSpan={g.count}
                      className="border-b border-r border-outline-variant/15 bg-surface-container-low text-left px-2 py-1"
                    >
                      <span className="font-[Hanken_Grotesk] text-[9px] font-semibold uppercase tracking-[0.07em] text-on-surface-variant/70 whitespace-nowrap">
                        {g.label}
                      </span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map((ms) => {
                    const isToday = ms === todayMs
                    const weekend = isWeekend(ms)
                    const mStart = isMonthStart(ms)
                    return (
                      <th
                        key={ms}
                        ref={isToday ? todayColRef : undefined}
                        className={[
                          'border-b border-r border-outline-variant/15 py-1 text-center select-none',
                          mStart ? 'border-l border-l-outline-variant/30' : '',
                        ].join(' ')}
                        style={{
                          width: CELL_W,
                          background: isToday
                            ? 'var(--color-primary-container)'
                            : weekend
                            ? 'var(--color-surface-container)'
                            : 'var(--color-surface-container-low)',
                        }}
                      >
                        <div
                          className="font-[Hanken_Grotesk] text-[8px] leading-none mb-0.5"
                          style={{
                            color: isToday
                              ? 'var(--color-on-primary-container)'
                              : 'var(--color-on-surface-variant)',
                            opacity: isToday ? 1 : 0.6,
                          }}
                        >
                          {fmtDow(ms)}
                        </div>
                        <div
                          className="font-[Hanken_Grotesk] text-[10px] font-semibold leading-none"
                          style={{
                            color: isToday
                              ? 'var(--color-on-primary-container)'
                              : 'var(--color-on-surface-variant)',
                          }}
                        >
                          {fmtDate(ms)}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, roomIdx) => {
                  const dayMap: Record<number, { res: Reservation; ci: number }> = {}
                  ;(resByRoom[room._id] ?? []).forEach((res, ri) => {
                    for (let d = res.checkInDate; d < res.checkOutDate; d += MS_PER_DAY)
                      dayMap[d] = { res, ci: ri % RES_COLORS.length }
                  })
                  return (
                    <tr
                      key={room._id}
                      style={{
                        background:
                          roomIdx % 2 === 0
                            ? 'var(--color-surface-container-lowest)'
                            : 'var(--color-surface-container-low)',
                      }}
                    >
                      {days.map((ms) => {
                        const isToday = ms === todayMs
                        const weekend = isWeekend(ms)
                        const mStart = isMonthStart(ms)
                        const entry = dayMap[ms]
                        if (!entry)
                          return (
                            <td
                              key={ms}
                              className={[
                                'border-b border-r border-outline-variant/10',
                                mStart ? 'border-l border-l-outline-variant/20' : '',
                              ].join(' ')}
                              style={{
                                height: ROW_H,
                                background: isToday
                                  ? 'color-mix(in srgb, var(--color-primary-container) 30%, transparent)'
                                  : weekend
                                  ? 'color-mix(in srgb, var(--color-surface-container) 50%, transparent)'
                                  : undefined,
                              }}
                            />
                          )
                        const { res, ci: colorIdx } = entry
                        const colors = RES_COLORS[colorIdx]
                        const isFirst = res.checkInDate === ms
                        const isLast = res.checkOutDate - MS_PER_DAY === ms
                        const isSel = selected?._id === res._id
                        return (
                          <td
                            key={ms}
                            className={[
                              'border-b border-outline-variant/10 cursor-pointer',
                              mStart ? 'border-l border-l-outline-variant/20' : '',
                            ].join(' ')}
                            style={{
                              height: ROW_H,
                              padding: '5px 0',
                              background: isToday
                                ? 'color-mix(in srgb, var(--color-primary-container) 30%, transparent)'
                                : undefined,
                            }}
                            onClick={() =>
                              onSelect(selected?._id === res._id ? null : res)
                            }
                            title={`${res.guestFullName} · ${new Date(res.checkInDate).toLocaleDateString()} – ${new Date(res.checkOutDate).toLocaleDateString()}`}
                          >
                            <div
                              style={{
                                height: '100%',
                                background: colors.bg,
                                borderLeft: isFirst
                                  ? `2px solid ${colors.accent}`
                                  : 'none',
                                borderRight: isLast
                                  ? `1px solid ${colors.accent}`
                                  : 'none',
                                borderTop: `1px solid ${colors.accent}`,
                                borderBottom: `1px solid ${colors.accent}`,
                                borderRadius:
                                  isFirst && isLast
                                    ? '3px'
                                    : isFirst
                                    ? '3px 0 0 3px'
                                    : isLast
                                    ? '0 3px 3px 0'
                                    : '0',
                                marginLeft: isFirst ? 1 : 0,
                                marginRight: isLast ? 1 : 0,
                                outline: isSel ? `1px solid ${colors.accent}` : 'none',
                                outlineOffset: 1,
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                              }}
                              className="hover:brightness-95 transition-all"
                            >
                              {isFirst && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    paddingLeft: 4,
                                    minWidth: 0,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: '50%',
                                      background:
                                        STATUS_COLOR[res.status] ?? '#94a3b8',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontFamily: 'Hanken Grotesk,sans-serif',
                                      fontSize: 9,
                                      fontWeight: 600,
                                      color: 'var(--color-on-surface)',
                                      opacity: 0.75,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {res.guestFullName.split(' ')[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
