import { useEffect, useMemo, useState } from 'react'
import { useI18n, type Locale } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { api } from '../../../convex/_generated/api'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import { WalkInCalendar } from './WalkInCalendar'

const MS_PER_DAY = 86_400_000

interface Props {
  isOpen: boolean
  onClose: () => void
  rooms: Doc<'rooms'>[]
}

interface Selection {
  guestCount: string
  totalPrice: string
}

interface Form {
  guestFullName: string
  guestEmail: string
  guestPhone: string
  specialRequests: string
}

const EMPTY_FORM: Form = {
  guestFullName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
}

function utcMidnightOf(d: Date) {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
}

export function WalkInModal({ isOpen, onClose, rooms }: Props) {
  const { locale } = useI18n()
  const { sessionToken } = useAdminAuth()
  const createWalkInGroup = useMutation(api.reservations.createWalkInGroup)

  const today = new Date()
  const todayMs = utcMidnightOf(today)
  const tomorrowMs = todayMs + MS_PER_DAY

  // Date range state (UTC midnight ms).
  const [checkIn, setCheckIn] = useState<number | null>(todayMs)
  const [checkOut, setCheckOut] = useState<number | null>(tomorrowMs)

  // Per-room selection map (roomId → guestCount + price override).
  const [selected, setSelected] = useState<Record<Id<'rooms'>, Selection>>({})

  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Reset state whenever the modal is reopened so the next walk-in starts clean.
  useEffect(() => {
    if (!isOpen) return
    setCheckIn(todayMs)
    setCheckOut(tomorrowMs)
    setSelected({})
    setForm(EMPTY_FORM)
    setError('')
    // Intentionally exclude todayMs/tomorrowMs from deps — they're derived
    // from `today` which is fresh for each open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const roomLabel = (r: Doc<'rooms'>) =>
    locale === 'ka' ? r.nameKa : r.nameEn

  const selectedIds = useMemo(
    () => Object.keys(selected) as Id<'rooms'>[],
    [selected],
  )

  const nights =
    checkIn && checkOut ? Math.round((checkOut - checkIn) / MS_PER_DAY) : 0

  // Auto-calculated total (uses overrides where present).
  const totalPrice = useMemo(() => {
    if (!nights) return 0
    let sum = 0
    for (const id of selectedIds) {
      const r = rooms.find((x) => x._id === id)
      if (!r) continue
      const sel = selected[id]
      const override = sel?.totalPrice ? parseFloat(sel.totalPrice) : NaN
      sum += Number.isFinite(override) ? override : r.pricePerNight * nights
    }
    return sum
  }, [selectedIds, selected, rooms, nights])

  const totalCapacity = useMemo(
    () =>
      selectedIds.reduce((acc, id) => {
        const sel = selected[id]
        const c = parseInt(sel?.guestCount ?? '0', 10) || 0
        return acc + c
      }, 0),
    [selectedIds, selected],
  )

  // Toggle a room into/out of the selection.
  function toggleRoom(roomId: Id<'rooms'>) {
    setSelected((prev) => {
      if (prev[roomId]) {
        const { [roomId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [roomId]: { guestCount: '1', totalPrice: '' } }
    })
  }

  function updateSelection(
    roomId: Id<'rooms'>,
    patch: Partial<Selection>,
  ) {
    setSelected((prev) => {
      const cur = prev[roomId]
      if (!cur) return prev
      return { ...prev, [roomId]: { ...cur, ...patch } }
    })
  }

  async function handleSubmit() {
    if (!sessionToken) return
    if (!checkIn || !checkOut) {
      setError(
        locale === 'ka' ? 'აირჩიეთ თარიღები' : locale === 'ru' ? 'Выберите даты заезда и выезда' : 'Pick check-in and check-out dates',
      )
      return
    }
    if (selectedIds.length === 0) {
      setError(
        locale === 'ka' ? 'აირჩიეთ მინიმუმ ერთი ნომერი' : locale === 'ru' ? 'Выберите хотя бы один номер' : 'Select at least one room',
      )
      return
    }
    if (!form.guestFullName.trim()) {
      setError(locale === 'ka' ? 'სახელი სავალდებულოა' : locale === 'ru' ? 'Имя гостя обязательно' : 'Guest name is required')
      return
    }

    // Build the rooms payload with per-room counts and optional overrides.
    const roomsPayload = selectedIds.map((roomId) => {
      const sel = selected[roomId]
      const guestCount = parseInt(sel.guestCount, 10) || 1
      const overrideRaw = sel.totalPrice.trim()
      const override = overrideRaw ? parseFloat(overrideRaw) : NaN
      return {
        roomId,
        guestCount,
        totalPrice: Number.isFinite(override) && override >= 0 ? override : undefined,
      }
    })

    setError('')
    setSaving(true)
    try {
      await createWalkInGroup({
        sessionToken,
        guestFullName: form.guestFullName,
        guestEmail: form.guestEmail.trim() || undefined,
        guestPhone: form.guestPhone.trim() || undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        specialRequests: form.specialRequests.trim() || undefined,
        rooms: roomsPayload,
      })
      onClose()
    } catch (e: unknown) {
      if (e instanceof ConvexError) {
        setError(e.data as string)
      } else {
        setError(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  // Status preview for the footer (matches what the backend will assign).
  const statusPreview =
    checkIn !== null && checkIn <= todayMs ? 'checkedIn' : 'confirmed'

  return (
    <div
      className="fixed inset-0 z-50 flex sm:items-center sm:justify-center bg-black/40 backdrop-blur-sm sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-surface-container-lowest border-0 sm:border border-outline-variant/30 sm:rounded-sm w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/20 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
              person_add
            </span>
            <div className="min-w-0">
              <h3 className="font-[EB_Garamond] text-[20px] sm:text-[22px] text-primary leading-tight truncate">
                {locale === 'ka' ? 'Walk-in ჯავშანი' : locale === 'ru' ? 'Прямое бронирование (Walk-in)' : 'Walk-in Booking'}
              </h3>
              <p className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant truncate">
                {locale === 'ka'
                  ? 'მრავალი ნომერი · ერთიანი ჯგუფი · ატომური ჯავშანი'
                  : locale === 'ru'
                  ? 'Несколько номеров · Единая группа · Атомарное бронирование'
                  : 'Multi-room · Single group · Atomic booking'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors shrink-0"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-5 sm:space-y-6">
          {/* Step 1 — Dates */}
          <Section
            step={1}
            title={locale === 'ka' ? 'თარიღები' : locale === 'ru' ? 'Даты' : 'Dates'}
            subtitle={
              locale === 'ka'
                ? 'აირჩიეთ შესვლისა და გასვლის თარიღი. დაკავებული დღეები გადახაზულია.'
                : locale === 'ru'
                ? 'Выберите даты заезда и выезда. Занятые дни зачеркнуты.'
                : 'Pick check-in and check-out. Booked days are shown with a strikethrough.'
            }
          >
            <DateRangeWithBlocked
              rooms={rooms}
              selectedRoomIds={selectedIds}
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={({ checkIn: ci, checkOut: co }) => {
                setCheckIn(ci)
                setCheckOut(co)
              }}
              locale={locale}
            />
          </Section>

          {/* Step 2 — Rooms */}
          <Section
            step={2}
            title={locale === 'ka' ? 'ნომრები' : locale === 'ru' ? 'Номера' : 'Rooms'}
            subtitle={
              locale === 'ka'
                ? 'აირჩიეთ ერთი ან მეტი ნომერი. თითოეულს შეუძლია ჰქონდეს თავისი სტუმრების რაოდენობა და ფასის გადატანა.'
                : locale === 'ru'
                ? 'Выберите один или несколько номеров. Для каждого можно указать количество гостей и изменить цену.'
                : 'Select one or more rooms. Each can carry its own guest count and an optional price override.'
            }
          >
            <RoomPicker
              rooms={rooms}
              selected={selected}
              onToggle={toggleRoom}
              onUpdate={updateSelection}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              locale={locale}
              sessionToken={sessionToken}
            />
          </Section>

          {/* Step 3 — Guest details */}
          <Section
            step={3}
            title={locale === 'ka' ? 'სტუმრის ინფორმაცია' : locale === 'ru' ? 'Информация о гостях' : 'Guest Information'}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={locale === 'ka' ? 'სრული სახელი *' : locale === 'ru' ? 'Полное имя *' : 'Full Name *'}
                value={form.guestFullName}
                onChange={(v) => setForm((f) => ({ ...f, guestFullName: v }))}
                placeholder={locale === 'ka' ? 'სახელი გვარი' : locale === 'ru' ? 'Имя Фамилия' : 'First Last'}
                disabled={saving}
              />
              <Field
                label={locale === 'ka' ? 'ტელეფონი' : locale === 'ru' ? 'Телефон' : 'Phone'}
                value={form.guestPhone}
                onChange={(v) => setForm((f) => ({ ...f, guestPhone: v }))}
                placeholder="+995 5XX XXX XXX"
                type="tel"
                disabled={saving}
              />
              <Field
                label={locale === 'ka' ? 'ელ-ფოსტა' : locale === 'ru' ? 'Эл. почта' : 'Email'}
                value={form.guestEmail}
                onChange={(v) => setForm((f) => ({ ...f, guestEmail: v }))}
                placeholder="guest@example.com"
                type="email"
                disabled={saving}
              />
              <Field
                label={locale === 'ka' ? 'შენიშვნა' : locale === 'ru' ? 'Особые пожелания' : 'Special Requests'}
                value={form.specialRequests}
                onChange={(v) => setForm((f) => ({ ...f, specialRequests: v }))}
                placeholder={locale === 'ka' ? 'მოთხოვნა...' : locale === 'ru' ? 'Пожелания...' : 'Notes...'}
                disabled={saving}
              />
            </div>
          </Section>

          {error && (
            <div className="flex items-start gap-2.5 bg-error/5 border border-error/30 rounded-sm px-3 py-2.5">
              <span className="material-symbols-outlined text-error text-[16px] mt-0.5">
                error
              </span>
              <span className="font-[Hanken_Grotesk] text-[12px] text-error leading-relaxed">
                {error}
              </span>
            </div>
          )}
        </div>

        {/* Footer — sticky summary + actions */}
        <div
          className="border-t border-outline-variant/20 bg-surface-container-low px-4 sm:px-6 py-3 sm:py-4 shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-[Hanken_Grotesk] text-[12px] text-on-surface-variant">
              <span>
                {locale === 'ka' ? 'ნომრები:' : locale === 'ru' ? 'Номера:' : 'Rooms:'}{' '}
                <span className="font-semibold text-primary">{selectedIds.length}</span>
              </span>
              <span>
                {locale === 'ka' ? 'ღამეები:' : locale === 'ru' ? 'Ночи:' : 'Nights:'}{' '}
                <span className="font-semibold text-primary">{nights}</span>
              </span>
              <span>
                {locale === 'ka' ? 'სტუმრები:' : locale === 'ru' ? 'Гости:' : 'Guests:'}{' '}
                <span className="font-semibold text-primary">{totalCapacity}</span>
              </span>
              <span>
                {locale === 'ka' ? 'ჯამი:' : locale === 'ru' ? 'Итого:' : 'Total:'}{' '}
                <span className="font-semibold text-primary">
                  ₾{totalPrice.toLocaleString()}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    statusPreview === 'checkedIn' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                />
                <span className="font-semibold text-primary">
                  {statusPreview === 'checkedIn'
                    ? locale === 'ka'
                      ? 'შესული'
                      : locale === 'ru'
                      ? 'Заселен'
                      : 'Checked In'
                    : locale === 'ka'
                    ? 'დადასტურებული'
                    : locale === 'ru'
                    ? 'Подтверждено'
                    : 'Confirmed'}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary border border-outline-variant transition-colors disabled:opacity-50"
              >
                {locale === 'ka' ? 'გაუქმება' : locale === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button
                onClick={() => void handleSubmit()}
                disabled={saving || selectedIds.length === 0 || !checkIn || !checkOut}
                className="flex items-center gap-1.5 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">
                    {statusPreview === 'checkedIn' ? 'login' : 'event_available'}
                  </span>
                )}
                {saving
                  ? locale === 'ka'
                    ? 'შენახვა...'
                    : locale === 'ru'
                    ? 'Сохранение...'
                    : 'Saving...'
                  : statusPreview === 'checkedIn'
                  ? locale === 'ka'
                    ? 'შესვლა'
                    : locale === 'ru'
                    ? 'Заселить'
                    : 'Check In'
                  : locale === 'ka'
                  ? 'დადასტურება'
                  : locale === 'ru'
                  ? 'Подтвердить'
                  : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function Section({
  step,
  title,
  subtitle,
  children,
}: {
  step: number
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="font-[Hanken_Grotesk] text-[10px] font-bold tracking-[0.1em] text-secondary">
          {String(step).padStart(2, '0')}
        </span>
        <h4 className="font-[EB_Garamond] text-[18px] text-primary">{title}</h4>
      </div>
      {subtitle && (
        <p className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant leading-relaxed -mt-1">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-outline disabled:opacity-50"
      />
    </div>
  )
}

/**
 * Calendar paired with a live blocked-set computed from the union of every
 * selected room's blocked dates. With no rooms selected it shows an empty
 * (fully open) calendar so the admin can pick dates first or last.
 */
function DateRangeWithBlocked({
  rooms,
  selectedRoomIds,
  checkIn,
  checkOut,
  onChange,
  locale,
}: {
  rooms: Doc<'rooms'>[]
  selectedRoomIds: Id<'rooms'>[]
  checkIn: number | null
  checkOut: number | null
  onChange: (next: { checkIn: number | null; checkOut: number | null }) => void
  locale: Locale
}) {
  // We always show blocked dates for ALL rooms by default so the admin sees
  // global occupancy at a glance. Once rooms are selected, the union is
  // restricted to those rooms (so an unrelated booking on a non-selected room
  // doesn't block selection here).
  const roomsToScan: Doc<'rooms'>[] =
    selectedRoomIds.length > 0
      ? rooms.filter((r) => selectedRoomIds.includes(r._id))
      : rooms

  return (
    <div className="space-y-2">
      <BlockedDatesProvider
        rooms={roomsToScan}
        mode={selectedRoomIds.length === 0 ? 'intersection' : 'union'}
      >
        {(blocked) => (
          <WalkInCalendar
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={onChange}
            blocked={blocked}
            locale={locale}
          />
        )}
      </BlockedDatesProvider>
    </div>
  )
}

/**
 * Subscribes to admin-blocked-dates queries for up to 8 rooms and merges
 * them into one Set. Built as a render-prop so it can be embedded inline
 * without polluting the parent's hooks.
 *
 * The 8-room cap matches the typical Kai inventory; if the property grows
 * beyond that, raise the limit here in lockstep.
 */
function BlockedDatesProvider({
  rooms,
  mode = 'union',
  children,
}: {
  rooms: Doc<'rooms'>[]
  mode?: 'union' | 'intersection'
  children: (blocked: Set<number>) => React.ReactNode
}) {
  const { sessionToken } = useAdminAuth()
  // 120-day forward window — long enough for almost every walk-in scenario,
  // small enough to keep the payload negligible.
  const fromDate = useMemo(() => {
    const d = new Date()
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])
  const throughDate = fromDate + 120 * MS_PER_DAY

  // Up to 8 parallel subscriptions. Convex dedupes by argument identity, so
  // this stays cheap.
  const ids = rooms.slice(0, 8).map((r) => r._id)

  // Always call the same number of hooks (React's rules of hooks).
  const r0 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[0]
      ? { sessionToken, roomId: ids[0], fromDate, throughDate }
      : 'skip',
  )
  const r1 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[1]
      ? { sessionToken, roomId: ids[1], fromDate, throughDate }
      : 'skip',
  )
  const r2 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[2]
      ? { sessionToken, roomId: ids[2], fromDate, throughDate }
      : 'skip',
  )
  const r3 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[3]
      ? { sessionToken, roomId: ids[3], fromDate, throughDate }
      : 'skip',
  )
  const r4 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[4]
      ? { sessionToken, roomId: ids[4], fromDate, throughDate }
      : 'skip',
  )
  const r5 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[5]
      ? { sessionToken, roomId: ids[5], fromDate, throughDate }
      : 'skip',
  )
  const r6 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[6]
      ? { sessionToken, roomId: ids[6], fromDate, throughDate }
      : 'skip',
  )
  const r7 = useQuery(
    api.reservations.getBlockedDatesForRoomAdmin,
    sessionToken && ids[7]
      ? { sessionToken, roomId: ids[7], fromDate, throughDate }
      : 'skip',
  )

  const blocked = useMemo(() => {
    const activeLists = [r0, r1, r2, r3, r4, r5, r6, r7]
      .slice(0, Math.min(rooms.length, 8))
      .filter((list): list is number[] => !!list)

    const out = new Set<number>()
    if (activeLists.length === 0) return out

    if (mode === 'intersection') {
      const firstList = activeLists[0]
      for (const ts of firstList) {
        const inAll = activeLists.every((list) => list.includes(ts))
        if (inAll) {
          out.add(ts)
        }
      }
    } else {
      for (const list of activeLists) {
        for (const ts of list) {
          out.add(ts)
        }
      }
    }
    return out
  }, [r0, r1, r2, r3, r4, r5, r6, r7, rooms.length, mode])

  return <>{children(blocked)}</>
}

/**
 * Card grid of rooms. Selected rooms expose per-room guest count + optional
 * price override controls. Conflicts (room blocked for the chosen dates) are
 * surfaced inline.
 */
function RoomPicker({
  rooms,
  selected,
  onToggle,
  onUpdate,
  checkIn,
  checkOut,
  nights,
  locale,
  sessionToken,
}: {
  rooms: Doc<'rooms'>[]
  selected: Record<Id<'rooms'>, Selection>
  onToggle: (roomId: Id<'rooms'>) => void
  onUpdate: (roomId: Id<'rooms'>, patch: Partial<Selection>) => void
  checkIn: number | null
  checkOut: number | null
  nights: number
  locale: Locale
  sessionToken: string | null
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rooms.map((r) => (
        <RoomCard
          key={r._id}
          room={r}
          selection={selected[r._id]}
          onToggle={() => onToggle(r._id)}
          onUpdate={(patch) => onUpdate(r._id, patch)}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          locale={locale}
          sessionToken={sessionToken}
        />
      ))}
    </div>
  )
}

function RoomCard({
  room,
  selection,
  onToggle,
  onUpdate,
  checkIn,
  checkOut,
  nights,
  locale,
  sessionToken,
}: {
  room: Doc<'rooms'>
  selection: Selection | undefined
  onToggle: () => void
  onUpdate: (patch: Partial<Selection>) => void
  checkIn: number | null
  checkOut: number | null
  nights: number
  locale: Locale
  sessionToken: string | null
}) {
  // Per-room availability check for the selected date range. Skip the query
  // entirely if dates aren't ready.
  const availability = useQuery(
    api.reservations.getAvailabilityForRoom,
    checkIn && checkOut
      ? { roomId: room._id, checkInDate: checkIn, checkOutDate: checkOut }
      : 'skip',
  )
  // sessionToken not strictly required by getAvailabilityForRoom (public),
  // but referenced to keep the prop chain explicit.
  void sessionToken

  const isSelected = !!selection
  const unavailable = availability ? availability.available === false : false
  const computedPrice = nights * room.pricePerNight
  const overrideRaw = selection?.totalPrice.trim() ?? ''
  const override = overrideRaw ? parseFloat(overrideRaw) : NaN
  const effectivePrice =
    Number.isFinite(override) && override >= 0 ? override : computedPrice

  const guestCountNum = parseInt(selection?.guestCount ?? '0', 10) || 0
  const overCapacity = guestCountNum > room.capacity

  const label = locale === 'ka' ? room.nameKa : room.nameEn
  const desc = locale === 'ka' ? room.descriptionKa : room.descriptionEn

  return (
    <div
      className={[
        'border rounded-sm p-3 transition-all',
        isSelected
          ? 'border-primary bg-primary/[0.03] ring-1 ring-primary/20'
          : 'border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant/60',
        unavailable && !isSelected && 'opacity-60',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={unavailable && !isSelected}
          className={[
            'shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors mt-0.5',
            isSelected
              ? 'border-primary bg-primary text-on-primary'
              : 'border-outline-variant hover:border-primary',
            unavailable && !isSelected && 'cursor-not-allowed opacity-50',
          ].join(' ')}
          aria-pressed={isSelected}
          aria-label={`Toggle ${label}`}
        >
          {isSelected && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h5 className="font-[EB_Garamond] text-[15px] text-primary leading-tight truncate">
              {label}
            </h5>
            <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary shrink-0">
              ₾{Math.round(room.pricePerNight)}
              <span className="text-secondary font-normal">
                {' '}
                / {locale === 'ka' ? 'ღამე' : locale === 'ru' ? 'ночь' : 'night'}
              </span>
            </span>
          </div>
          <p className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
            {desc}
          </p>
          <div className="flex items-center gap-3 mt-1.5 font-[Hanken_Grotesk] text-[10px] text-secondary">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">person</span>
              {locale === 'ka' ? 'ტევადობა' : locale === 'ru' ? 'Вместимость' : 'Capacity'}: {room.capacity}
            </span>
            {unavailable && (
              <span className="flex items-center gap-1 text-error">
                <span className="material-symbols-outlined text-[12px]">block</span>
                {locale === 'ka' ? 'დაკავებული' : locale === 'ru' ? 'Забронировано' : 'Booked'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Per-room controls (revealed when selected) */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-outline-variant/20 grid grid-cols-3 gap-3">
          <div className="space-y-0.5">
            <label className="font-[Hanken_Grotesk] text-[9px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block">
              {locale === 'ka' ? 'სტუმრები' : locale === 'ru' ? 'Гости' : 'Guests'}
            </label>
            <input
              type="number"
              min={1}
              max={room.capacity}
              value={selection.guestCount}
              onChange={(e) => onUpdate({ guestCount: e.target.value })}
              className={[
                'w-full bg-transparent border-b py-1 font-[Hanken_Grotesk] text-[13px] text-on-surface outline-none transition-colors',
                overCapacity
                  ? 'border-error focus:border-error'
                  : 'border-outline focus:border-primary',
              ].join(' ')}
            />
            {overCapacity && (
              <span className="font-[Hanken_Grotesk] text-[9px] text-error">
                {locale === 'ka'
                  ? `მაქს. ${room.capacity}`
                  : locale === 'ru'
                  ? `Макс. ${room.capacity}`
                  : `Max ${room.capacity}`}
              </span>
            )}
          </div>
          <div className="space-y-0.5 col-span-2">
            <label className="font-[Hanken_Grotesk] text-[9px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block">
              {locale === 'ka' ? 'ფასი ₾ (ცვლილება)' : locale === 'ru' ? 'Цена ₾ (изменение)' : 'Price ₾ (override)'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={1}
                value={selection.totalPrice}
                onChange={(e) => onUpdate({ totalPrice: e.target.value })}
                placeholder={`auto: ${Math.round(computedPrice)}`}
                className="flex-1 bg-transparent border-b border-outline py-1 font-[Hanken_Grotesk] text-[13px] text-on-surface outline-none focus:border-primary transition-colors placeholder:text-outline"
              />
              <span className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant whitespace-nowrap">
                = ₾{Math.round(effectivePrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
