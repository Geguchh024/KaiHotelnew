import { useState, useEffect } from 'react'
import { createFileRoute, Link, Outlet, useNavigate, useMatches } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { ConvexError } from 'convex/values'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomSelect } from '@/components/ui/custom-select'
import { BlurhashImage } from '@/components/BlurhashImage'
import { addDays, differenceInDays, format } from 'date-fns'
import { ka, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { Id } from '../../convex/_generated/dataModel'
import { z } from 'zod'

const reservationSearchSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().optional(),
})

export const Route = createFileRoute('/reservations')({
  validateSearch: reservationSearchSchema,
  head: () => ({
    meta: [
      {
        title: 'დაჯავშნე — Book | Kai Hotel Bar Tbilisi | Free Cancellation',
      },
      {
        name: 'description',
        content: 'Book Kai Hotel Bar Tbilisi from ₾33/night. Free cancellation, no credit card, pay at property. Economy, Twin, Deluxe, Triple & Dorm rooms. Best rate guaranteed.',
      },
      {
        name: 'keywords',
        content: 'book hotel Tbilisi, Kai Hotel reservation, დაჯავშნე თბილისი, free cancellation hotel Tbilisi, no prepayment hotel Georgia, hotel booking Tbilisi',
      },
    ],
  }),
  component: ReservationsLayout,
})

/** Layout wrapper — renders child routes (confirmation) or the booking form. */
function ReservationsLayout() {
  const matches = useMatches()
  // If there's a child route active (more than just /reservations), render the Outlet
  const hasChildRoute = matches.some(m => m.id.includes('/confirmation/'))
  if (hasChildRoute) {
    return <Outlet />
  }
  return <Reservations />
}

/** Convert a local Date to UTC-midnight milliseconds (calendar-date label). */
function toUtcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

function Reservations() {
  const { t, locale, setLocale } = useI18n()
  const navigate = useNavigate()
  const dateLocale = locale === 'ka' ? ka : enUS
  const search = Route.useSearch()

  // Parse search params into initial dates
  const initialCheckIn = search.checkIn ? new Date(search.checkIn) : null
  const initialCheckOut = search.checkOut ? new Date(search.checkOut) : null
  const initialGuests = search.guests || '2'

  // Live room data from Convex
  const rooms = useQuery(api.rooms.list)

  // Form state
  const [step, setStep] = useState(1)
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn)
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut)
  const [guests, setGuests] = useState(initialGuests)
  const [selectedRooms, setSelectedRooms] = useState<Id<"rooms">[]>([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Blocked dates query — 90-day window from today
  const today = new Date()
  const fromDate = toUtcMidnight(today)
  const throughDate = toUtcMidnight(addDays(today, 90))

  const nightCount = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const guestCount = parseInt(guests, 10)
  const selectedRoomsData = rooms?.filter((r) => selectedRooms.includes(r._id)) ?? []
  const totalCapacity = selectedRoomsData.reduce((sum, r) => sum + r.capacity, 0)
  const totalPrice = Math.round(selectedRoomsData.reduce((sum, r) => sum + r.pricePerNight * nightCount, 0))
  const capacityMet = totalCapacity >= guestCount
  const canProceedStep1 = checkIn && checkOut && selectedRooms.length > 0 && nightCount > 0 && capacityMet
  const canProceedStep2 = fullName && email && phone

  // Toggle room selection
  const toggleRoom = (roomId: Id<"rooms">) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  // Remove a room from selection (used by useEffect in RoomCard when it becomes unavailable)
  const removeRoom = (roomId: Id<"rooms">) => {
    setSelectedRooms((prev) => prev.filter((id) => id !== roomId))
  }

  // Mutation for creating reservation
  const createReservation = useMutation(api.reservations.create)

  const handleConfirm = async () => {
    if (selectedRooms.length === 0 || !checkIn || !checkOut) return
    setError(null)
    setSubmitting(true)
    try {
      // Create a reservation for each selected room, splitting guests proportionally
      let lastReferenceCode = ''
      let remainingGuests = guestCount
      for (let i = 0; i < selectedRooms.length; i++) {
        const roomId = selectedRooms[i]
        const roomData = rooms?.find((r) => r._id === roomId)
        // Assign guests: fill each room up to capacity, last room gets the remainder
        const roomGuestCount = i < selectedRooms.length - 1
          ? Math.min(remainingGuests, roomData?.capacity ?? remainingGuests)
          : remainingGuests
        remainingGuests -= roomGuestCount

        const result = await createReservation({
          roomId,
          guestFullName: fullName.trim(),
          guestEmail: email.trim(),
          guestPhone: phone.trim(),
          guestCount: Math.max(1, roomGuestCount),
          checkInDate: toUtcMidnight(checkIn),
          checkOutDate: toUtcMidnight(checkOut),
          specialRequests: specialRequests.trim() || undefined,
        })
        lastReferenceCode = result.referenceCode
      }
      void navigate({ to: '/reservations/confirmation/$referenceCode', params: { referenceCode: lastReferenceCode } })
    } catch (err: unknown) {
      if (err instanceof ConvexError) {
        setError(err.data as string)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
        <nav className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-[1280px] mx-auto">
          <Link to="/" className="font-[EB_Garamond] text-[20px] sm:text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity">
            Kai Hotel Bar
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
              className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2 sm:px-2.5 py-1.5 rounded-sm"
            >
              {locale === 'ka' ? 'EN' : 'ქარ'}
            </button>
            <Link to="/" className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">
              {t('res.backToHome')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[72px] min-h-screen bg-background">
        <div className="bg-primary py-8 sm:py-10 px-4 sm:px-6">
          <div className="max-w-[1080px] mx-auto text-center">
            <h1 className="font-[EB_Garamond] text-[22px] sm:text-[26px] md:text-[34px] leading-[1.2] text-on-primary mb-2 font-georgian">
              {t('res.title')}
            </h1>
            <p className="font-[Hanken_Grotesk] text-[12px] leading-[1.5] text-on-primary/70 max-w-lg mx-auto font-georgian">
              {t('res.subtitle')}
            </p>
          </div>
        </div>

        <div className="border-b border-outline-variant/30 bg-surface-container-lowest">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-center gap-2 md:gap-6">
              {[
                { num: 1, label: t('res.step1') },
                { num: 2, label: t('res.step2') },
                { num: 3, label: t('res.step3') },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 md:gap-3">
                  {i > 0 && <div className="w-6 md:w-10 h-px bg-outline-variant/50"></div>}
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors',
                      step >= s.num ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary',
                    )}>
                      {step > s.num ? <span className="material-symbols-outlined text-[12px]">check</span> : s.num}
                    </div>
                    <span className={cn(
                      'font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.03em] hidden md:block font-georgian',
                      step >= s.num ? 'text-primary' : 'text-secondary',
                    )}>
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {step === 1 && (
            <Step1
              rooms={rooms}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              guests={guests}
              setGuests={setGuests}
              selectedRooms={selectedRooms}
              toggleRoom={toggleRoom}
              removeRoom={removeRoom}
              nightCount={nightCount}
              totalPrice={totalPrice}
              totalCapacity={totalCapacity}
              guestCount={guestCount}
              capacityMet={capacityMet}
              canProceedStep1={!!canProceedStep1}
              setStep={setStep}
              locale={locale}
              t={t}
              fromDate={fromDate}
              throughDate={throughDate}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
                <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian">{t('res.guestInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{locale === 'ka' ? 'სრული სახელი' : 'Full Name'} *</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.email')} *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.phone')} *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+995 5XX XXX XXX" className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors placeholder:text-outline" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.specialRequests')}</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={t('res.specialRequestsPlaceholder')} rows={2} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors resize-none placeholder:text-outline" />
                  </div>
                </div>
              </div>

              {selectedRoomsData.length > 0 && (
                <div className="bg-surface-container-low border border-outline-variant/20 p-4">
                  <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-2 font-georgian">{t('res.summary')}</h4>
                  {selectedRoomsData.map((room) => (
                    <div key={room._id} className="flex items-center gap-3 mb-2 last:mb-0">
                      <BlurhashImage src={room.imageUrl} alt={locale === 'ka' ? room.nameKa : room.nameEn} blurhash={room.blurhash} className="w-12 h-12" />
                      <div className="flex-1">
                        <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary">{locale === 'ka' ? room.nameKa : room.nameEn}</p>
                        <p className="font-[Hanken_Grotesk] text-[10px] text-secondary">
                          {checkIn && format(checkIn, 'd MMM', { locale: dateLocale })} — {checkOut && format(checkOut, 'd MMM', { locale: dateLocale })} &middot; {nightCount} {t('res.nights')}
                        </p>
                      </div>
                      <span className="font-[Hanken_Grotesk] text-[14px] font-bold text-primary">&#8382;{Math.round(room.pricePerNight * nightCount)}</span>
                    </div>
                  ))}
                  {selectedRoomsData.length > 1 && (
                    <div className="border-t border-outline-variant/20 mt-2 pt-2 flex justify-between">
                      <span className="font-[Hanken_Grotesk] text-[11px] font-semibold text-primary font-georgian">{t('res.total')}</span>
                      <span className="font-[Hanken_Grotesk] text-[14px] font-bold text-primary">&#8382;{totalPrice}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant font-georgian">
                  <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                  {t('res.back')}
                </button>
                <button
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] transition-all font-georgian',
                    canProceedStep2 ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-surface-container-high text-secondary cursor-not-allowed',
                  )}
                >
                  {t('res.next')}
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedRoomsData.length > 0 && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
                <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian">{t('res.summary')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian">{t('res.roomDetails')}</h4>
                    {selectedRoomsData.map((room) => (
                      <div key={room._id} className="flex gap-3 mb-3">
                        <BlurhashImage src={room.imageUrl} alt={locale === 'ka' ? room.nameKa : room.nameEn} blurhash={room.blurhash} className="w-20 h-16" />
                        <div>
                          <p className="font-[EB_Garamond] text-[14px] font-medium text-primary">{locale === 'ka' ? room.nameKa : room.nameEn}</p>
                          <p className="font-[Hanken_Grotesk] text-[10px] text-secondary mt-0.5">{t('res.capacity')}: {room.capacity} &middot; &#8382;{Math.round(room.pricePerNight * nightCount)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('booking.checkin')}</span><span className="text-primary font-semibold">{checkIn && format(checkIn, 'dd MMM yyyy', { locale: dateLocale })}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('booking.checkout')}</span><span className="text-primary font-semibold">{checkOut && format(checkOut, 'dd MMM yyyy', { locale: dateLocale })}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.nights')}</span><span className="text-primary font-semibold">{nightCount}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('booking.guests')}</span><span className="text-primary font-semibold">{guests}</span></div>
                      <div className="flex justify-between border-t border-outline-variant/20 pt-1.5 mt-1.5">
                        <span className="text-primary font-semibold font-georgian">{t('res.total')}</span>
                        <span className="text-primary font-bold text-[14px]">&#8382;{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian">{t('res.guestDetails')}</h4>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{locale === 'ka' ? 'სრული სახელი' : 'Full Name'}</span><span className="text-primary font-semibold">{fullName}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.email')}</span><span className="text-primary font-semibold">{email}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.phone')}</span><span className="text-primary font-semibold">{phone}</span></div>
                      {specialRequests && (
                        <div className="pt-1.5 border-t border-outline-variant/20 mt-1.5">
                          <span className="text-secondary font-georgian block mb-0.5">{t('res.specialRequests')}</span>
                          <span className="text-primary text-[10px]">{specialRequests}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/20 p-4 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">info</span>
                <div>
                  <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary font-georgian">{t('res.payAtHotel')}</p>
                  <p className="font-[Hanken_Grotesk] text-[11px] text-secondary mt-0.5 font-georgian">{t('res.payAtHotelDesc')}</p>
                </div>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/30 p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[16px]">error</span>
                  <p className="font-[Hanken_Grotesk] text-[12px] text-error">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant font-georgian">
                  <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                  {t('res.back')}
                </button>
                <button
                  disabled={submitting}
                  onClick={handleConfirm}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian',
                    submitting && 'opacity-60 cursor-not-allowed',
                  )}
                >
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  {submitting ? (locale === 'ka' ? 'იგზავნება...' : 'Submitting...') : t('res.confirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-6 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-3 px-4 sm:px-6 max-w-[1280px] mx-auto">
          <div className="font-[EB_Garamond] text-[16px] font-medium text-primary">Kai Hotel Bar</div>
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-[13px]">call</span>
            <a href="tel:+995511222028" className="font-[Hanken_Grotesk] text-[11px] hover:text-primary transition-colors">{t('footer.phone')}</a>
          </div>
          <p className="font-[Hanken_Grotesk] text-[10px] text-secondary/60 font-georgian">{t('footer.copyright')}</p>
        </div>
      </footer>
    </>
  )
}


/** Step 1 component — extracted so each room can call useQuery for blocked dates. */
function Step1({
  rooms,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  selectedRooms,
  toggleRoom,
  removeRoom,
  nightCount,
  totalPrice,
  totalCapacity,
  guestCount,
  capacityMet,
  canProceedStep1,
  setStep,
  locale,
  t,
  fromDate,
  throughDate,
}: {
  rooms: ReturnType<typeof useQuery<typeof api.rooms.list>> | undefined
  checkIn: Date | null
  setCheckIn: (d: Date | null) => void
  checkOut: Date | null
  setCheckOut: (d: Date | null) => void
  guests: string
  setGuests: (v: string) => void
  selectedRooms: Id<"rooms">[]
  toggleRoom: (id: Id<"rooms">) => void
  removeRoom: (id: Id<"rooms">) => void
  nightCount: number
  totalPrice: number
  totalCapacity: number
  guestCount: number
  capacityMet: boolean
  canProceedStep1: boolean
  setStep: (s: number) => void
  locale: 'ka' | 'en'
  t: (key: string) => string
  fromDate: number
  throughDate: number
}) {
  // Query blocked dates for all selected rooms and merge them for the calendar.
  // We use individual hooks for up to 4 rooms (typical hotel has 3-5 rooms).
  const room0 = selectedRooms[0] ?? null
  const room1 = selectedRooms[1] ?? null
  const room2 = selectedRooms[2] ?? null
  const room3 = selectedRooms[3] ?? null

  const blocked0 = useQuery(api.reservations.getBlockedDatesForRoom, room0 ? { roomId: room0, fromDate, throughDate } : "skip")
  const blocked1 = useQuery(api.reservations.getBlockedDatesForRoom, room1 ? { roomId: room1, fromDate, throughDate } : "skip")
  const blocked2 = useQuery(api.reservations.getBlockedDatesForRoom, room2 ? { roomId: room2, fromDate, throughDate } : "skip")
  const blocked3 = useQuery(api.reservations.getBlockedDatesForRoom, room3 ? { roomId: room3, fromDate, throughDate } : "skip")

  // Merge all blocked dates from selected rooms into one set, then find dates
  // blocked across ALL selected rooms (intersection = dates where no selected room is free)
  const disabledDates = (() => {
    if (selectedRooms.length === 0) return []
    const allBlocked = [blocked0, blocked1, blocked2, blocked3]
      .slice(0, selectedRooms.length)

    // If any query is still loading, don't disable anything yet
    if (allBlocked.some((b) => b === undefined)) return []

    // Union: disable any date that is blocked in ANY selected room.
    // This prevents picking a range that conflicts with any of the selected rooms.
    const union = new Set<number>()
    for (const dates of allBlocked) {
      for (const ts of dates ?? []) {
        union.add(ts)
      }
    }
    return Array.from(union).map((ts) => new Date(ts))
  })()

  return (
    <div className="space-y-8">
      <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
        <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-4 font-georgian">
          {t('res.dates')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            value={checkIn}
            onChange={(date) => { setCheckIn(date); if (checkOut && date >= checkOut) setCheckOut(null) }}
            placeholder={t('booking.selectDate')}
            locale={locale}
            icon="calendar_today"
            label={t('booking.checkin')}
            minDate={new Date()}
            disabledDates={disabledDates}
            rangeStart={checkIn}
            rangeEnd={checkOut}
          />
          <DatePicker
            value={checkOut}
            onChange={setCheckOut}
            placeholder={t('booking.selectDate')}
            locale={locale}
            icon="calendar_month"
            minDate={checkIn ? addDays(checkIn, 1) : new Date()}
            disabledDates={disabledDates}
            label={t('booking.checkout')}
            rangeStart={checkIn}
            rangeEnd={checkOut}
          />
          <CustomSelect
            value={guests}
            onChange={setGuests}
            icon="person"
            label={t('booking.guests')}
            options={[
              { value: '1', label: locale === 'ka' ? '1 სტუმარი' : '1 Guest' },
              { value: '2', label: locale === 'ka' ? '2 სტუმარი' : '2 Guests' },
              { value: '3', label: locale === 'ka' ? '3 სტუმარი' : '3 Guests' },
              { value: '4', label: locale === 'ka' ? '4 სტუმარი' : '4 Guests' },
              { value: '5', label: locale === 'ka' ? '5 სტუმარი' : '5 Guests' },
              { value: '6', label: locale === 'ka' ? '6 სტუმარი' : '6 Guests' },
              { value: '7', label: locale === 'ka' ? '7 სტუმარი' : '7 Guests' },
              { value: '8', label: locale === 'ka' ? '8 სტუმარი' : '8 Guests' },
              { value: '9', label: locale === 'ka' ? '9 სტუმარი' : '9 Guests' },
              { value: '10', label: locale === 'ka' ? '10+ სტუმარი' : '10+ Guests' },
            ]}
          />
        </div>
        {nightCount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[14px]">dark_mode</span>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold">{nightCount} {t('res.nights')}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-4 font-georgian">
          {t('res.selectRoom')}
        </h3>
        {!rooms ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-primary text-[24px] animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                selectedRooms={selectedRooms}
                toggleRoom={toggleRoom}
                removeRoom={removeRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                locale={locale}
                t={t}
                fromDate={fromDate}
                throughDate={throughDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Capacity indicator */}
      {selectedRooms.length > 0 && (
        <div className={cn(
          'flex items-center gap-2 p-3 border rounded-sm',
          capacityMet ? 'border-primary/30 bg-primary/5' : 'border-amber-300 bg-amber-50',
        )}>
          <span className="material-symbols-outlined text-[16px]" style={{ color: capacityMet ? 'var(--color-primary)' : '#d97706' }}>
            {capacityMet ? 'check_circle' : 'warning'}
          </span>
          <span className="font-[Hanken_Grotesk] text-[11px] font-georgian" style={{ color: capacityMet ? 'var(--color-primary)' : '#d97706' }}>
            {locale === 'ka'
              ? `არჩეული ტევადობა: ${totalCapacity} / საჭირო: ${guestCount} სტუმარი`
              : `Selected capacity: ${totalCapacity} / Need: ${guestCount} guests`}
            {!capacityMet && (locale === 'ka' ? ' — აირჩიეთ მეტი ნომერი' : ' — select more rooms')}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
        <div>
          {selectedRooms.length > 0 && nightCount > 0 && (
            <div className="font-[Hanken_Grotesk] text-[12px] text-secondary font-georgian">
              {t('res.total')}: <span className="text-primary font-bold text-[15px]">&#8382;{totalPrice}</span>
              <span className="text-[10px] ml-1">({nightCount} {t('res.nights')} &middot; {selectedRooms.length} {locale === 'ka' ? 'ნომერი' : selectedRooms.length === 1 ? 'room' : 'rooms'})</span>
            </div>
          )}
        </div>
        <button
          disabled={!canProceedStep1}
          onClick={() => setStep(2)}
          className={cn(
            'flex items-center gap-2 px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] transition-all font-georgian',
            canProceedStep1 ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-surface-container-high text-secondary cursor-not-allowed',
          )}
        >
          {t('res.next')}
          <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}

/** Individual room card — calls useQuery for blocked dates per room. */
function RoomCard({
  room,
  selectedRooms,
  toggleRoom,
  removeRoom,
  checkIn,
  checkOut,
  locale,
  t,
  fromDate,
  throughDate,
}: {
  room: { _id: Id<"rooms">; nameKa: string; nameEn: string; descriptionKa: string; descriptionEn: string; pricePerNight: number; capacity: number; amenities: string[]; imageUrl: string; blurhash?: string }
  selectedRooms: Id<"rooms">[]
  toggleRoom: (id: Id<"rooms">) => void
  removeRoom: (id: Id<"rooms">) => void
  checkIn: Date | null
  checkOut: Date | null
  locale: 'ka' | 'en'
  t: (key: string) => string
  fromDate: number
  throughDate: number
}) {
  // Query blocked dates for this room
  const blockedDates = useQuery(api.reservations.getBlockedDatesForRoom, {
    roomId: room._id,
    fromDate,
    throughDate,
  })

  // Check if the selected date range overlaps with blocked dates for this room
  const isUnavailable = (() => {
    if (!checkIn || !checkOut || !blockedDates) return false
    const ciMs = toUtcMidnight(checkIn)
    const coMs = toUtcMidnight(checkOut)
    // Check if any blocked date falls within [checkIn, checkOut)
    return blockedDates.some((d) => d >= ciMs && d < coMs)
  })()

  const isSelected = selectedRooms.includes(room._id)

  // If this room is selected but becomes unavailable (e.g. user changed dates), deselect it
  useEffect(() => {
    if (isSelected && isUnavailable) {
      removeRoom(room._id)
    }
  }, [isSelected, isUnavailable, removeRoom, room._id])

  const roomName = locale === 'ka' ? room.nameKa : room.nameEn
  const roomDesc = locale === 'ka' ? room.descriptionKa : room.descriptionEn

  return (
    <div
      onClick={() => !isUnavailable && toggleRoom(room._id)}
      className={cn(
        'border bg-surface-container-lowest overflow-hidden transition-all cursor-pointer',
        isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant/20 hover:border-outline-variant/50',
        isUnavailable && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-[160px] h-[120px] sm:h-auto flex-shrink-0 overflow-hidden relative">
          <BlurhashImage src={room.imageUrl} alt={roomName} blurhash={room.blurhash} className="w-full h-full" />
          {isUnavailable && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase text-error font-georgian">{t('res.unavailable')}</span>
            </div>
          )}
          {isSelected && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>
            </div>
          )}
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-1.5">
            <h4 className="font-[EB_Garamond] text-[15px] font-medium text-primary">{roomName}</h4>
            <div className="text-right">
              <span className="font-[Hanken_Grotesk] text-[14px] font-bold text-primary">&#8382;{Math.round(room.pricePerNight)}</span>
              <span className="font-[Hanken_Grotesk] text-[9px] text-secondary block">{t('res.perNight')}</span>
            </div>
          </div>
          <p className="font-[Hanken_Grotesk] text-[11px] leading-[1.5] text-secondary mb-2.5 font-georgian">{roomDesc}</p>
          <div className="flex items-center gap-3 text-[10px] text-on-surface-variant mb-2">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">person</span>
              {room.capacity}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 4).map((a) => (
              <span key={a} className="font-[Hanken_Grotesk] text-[9px] bg-surface-container px-1.5 py-0.5 text-secondary">{a}</span>
            ))}
            {room.amenities.length > 4 && (
              <span className="font-[Hanken_Grotesk] text-[9px] text-primary font-semibold px-1 py-0.5">+{room.amenities.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
