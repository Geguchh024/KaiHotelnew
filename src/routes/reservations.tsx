import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomSelect } from '@/components/ui/custom-select'
import { addDays, differenceInDays, format } from 'date-fns'
import { ka, enUS } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/reservations')({
  component: Reservations,
})

const rooms = [
  {
    id: 'standard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNaQ2CxjWnz-SqNgtseplFra2Yklt2cRdneNh2Zcqdn7QTDTiRrIvURULn-c6VRACpvXxfGIZ6RC874Iqn5LyHDRBjb2sQxPbtXcuhwtEJgawbyUhL5rjh03Lv643X4-vnKWmCO13_NUz23A0aRZ3Gm5J5L76njpViRN6W25QoNjsGEVZ8W7mz1wfyoQndVnz7Lb0EAg3LHVts5IFQdz3VY6Uteu0ATIboZvb4WFmgP5Ksdn8RO6czc4RihFArthaaThRjX1mx6w',
    name: { ka: 'სტანდარტული ნომერი', en: 'Standard Room' },
    description: { ka: 'კომფორტული ნომერი ყველა საჭირო კეთილმოწყობით, იდეალური მოკლე ვიზიტისთვის.', en: 'Comfortable room with all essential amenities, ideal for short visits.' },
    price: 120,
    capacity: 2,
    size: '22 m2',
    amenities: { ka: ['Wi-Fi', 'კონდიციონერი', 'მინი-ბარი', 'სეიფი'], en: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Safe'] },
    available: true,
  },
  {
    id: 'deluxe',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdYLOCkbl4imubXOzryG3zZTarGntdjsdo_zIJBMXRQyL_1veF5CnAeOO2xqMsB6h2HIJmOEFAGIkviXG77q5DFO7tw5P4Fi8DynZeTLIUOm8M6Nwaq-safFuZ2gHra-Q45432Kye9ZiawpZV1MEOtxtaV-WKrzzV14Q9rWGICfLKR4ZWvD1YpNhuc8W7WqzLMt5Xc_t9GGc8b0x573ugqlhg-KYLlWxYUXoydOOTAUpugGpE6vlAsr0RLWpIqeC43WEgs5wKKoQ',
    name: { ka: 'დელუქს ნომერი', en: 'Deluxe Room' },
    description: { ka: 'გაფართოებული ნომერი ტერასით და ბაღის ხედით, პრემიუმ კეთილმოწყობით.', en: 'Spacious room with terrace and garden view, premium amenities included.' },
    price: 180,
    capacity: 2,
    size: '30 m2',
    amenities: { ka: ['Wi-Fi', 'კონდიციონერი', 'მინი-ბარი', 'სეიფი', 'ტერასა', 'ბაღის ხედი'], en: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Safe', 'Terrace', 'Garden View'] },
    available: true,
  },
  {
    id: 'family',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXBHloncPNvIKTxdi_NpTFbcW72yA7Kmr4lPP32yovsRnqCmu2XmPehBmHkunI0E5sM4azooCY3hjOTzUOOFZ5M_XSHXfDrSjkyeCQhr53KxQJskol41bUtnFCPShUQ8lzoGLwXehhdj8jHmpPzbrrUPH5nCQJwmjkY6YORD3SLvYziYkjc3MjtG-KxJ439SN9BhDzknY5Ltk-8Dv36MdgjPMdzBPzE3KmQYLn8WfMMrqFr5UJIsz1Bu2N8go_an_uyh43llMMLQ',
    name: { ka: 'საოჯახო ნომერი', en: 'Family Suite' },
    description: { ka: 'ფართო საოჯახო ნომერი ცალკე საძინებლით, იდეალური ოჯახებისთვის.', en: 'Spacious family suite with separate bedroom, ideal for families.' },
    price: 250,
    capacity: 4,
    size: '45 m2',
    amenities: { ka: ['Wi-Fi', 'კონდიციონერი', 'მინი-ბარი', 'სეიფი', 'ტერასა', 'ბაღის ხედი', 'საბავშვო საწოლი'], en: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Safe', 'Terrace', 'Garden View', 'Baby Cot'] },
    available: true,
  },
  {
    id: 'suite',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAA2d2ZfDG8Dd5e6HAagMgOsAKcdMOoIcca4i3XcVsBkGtjFAqGMyZzyixaOWpkI1gkIRXFeGPKk3-cWyQcjSpeXpxsMq-7_Z757rsjvI4kbg-SWN1eKBtJBx8G4aNR9xxt41C7ums9ukZS2gwbNM4VTnEMLVGI3LjhaXzBkiYeyfAdcmh2MlQHen131s0KwC6bPNvEecbq6ZXBDmIq0twdIcJiB90jXlN82IhUviSG4YoZdGiTHAR1dWibOktPV2fBAqst71ZKA',
    name: { ka: 'პრემიუმ ლუქსი', en: 'Premium Suite' },
    description: { ka: 'ექსკლუზიური ლუქს ნომერი პანორამული ხედით და პრემიუმ სერვისით.', en: 'Exclusive suite with panoramic views and premium service.' },
    price: 350,
    capacity: 2,
    size: '55 m2',
    amenities: { ka: ['Wi-Fi', 'კონდიციონერი', 'მინი-ბარი', 'სეიფი', 'ტერასა', 'პანორამული ხედი', 'მისაღები', 'ჯაკუზი'], en: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Safe', 'Terrace', 'Panoramic View', 'Living Room', 'Jacuzzi'] },
    available: false,
  },
]

const unavailableDates = [
  addDays(new Date(), 3),
  addDays(new Date(), 4),
  addDays(new Date(), 10),
  addDays(new Date(), 11),
  addDays(new Date(), 12),
  addDays(new Date(), 18),
  addDays(new Date(), 25),
  addDays(new Date(), 26),
]

function Reservations() {
  const { t, locale, setLocale } = useI18n()
  const dateLocale = locale === 'ka' ? ka : enUS
  const [step, setStep] = useState(1)
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState('2')
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  const nightCount = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const selectedRoomData = rooms.find((r) => r.id === selectedRoom)
  const totalPrice = selectedRoomData ? selectedRoomData.price * nightCount : 0
  const canProceedStep1 = checkIn && checkOut && selectedRoom && nightCount > 0
  const canProceedStep2 = firstName && lastName && email && phone

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
        <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
          <Link to="/" className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium hover:opacity-80 transition-opacity">
            Kai Hotel Bar
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
              className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2.5 py-1.5 rounded-sm"
            >
              {locale === 'ka' ? 'EN' : 'ქარ'}
            </button>
            <Link to="/" className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors">
              {t('res.backToHome')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[72px] min-h-screen bg-background">
        <div className="bg-primary py-10 px-6">
          <div className="max-w-[1080px] mx-auto text-center">
            <h1 className="font-[EB_Garamond] text-[26px] md:text-[34px] leading-[1.2] text-on-primary mb-2 font-georgian">
              {t('res.title')}
            </h1>
            <p className="font-[Hanken_Grotesk] text-[12px] leading-[1.5] text-on-primary/70 max-w-lg mx-auto font-georgian">
              {t('res.subtitle')}
            </p>
          </div>
        </div>

        <div className="border-b border-outline-variant/30 bg-surface-container-lowest">
          <div className="max-w-[1080px] mx-auto px-6 py-3">
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

        <div className="max-w-[1080px] mx-auto px-6 py-8">

          {step === 1 && (
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
                    disabledDates={unavailableDates}
                    label={t('booking.checkin')}
                    rangeStart={checkIn}
                    rangeEnd={checkOut}
                  />
                  <DatePicker
                    value={checkOut}
                    onChange={setCheckOut}
                    placeholder={t('booking.selectDate')}
                    locale={locale}
                    icon="calendar_month"
                    disabledDates={unavailableDates}
                    minDate={checkIn ? addDays(checkIn, 1) : new Date()}
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
                      { value: '5', label: locale === 'ka' ? '5+ სტუმარი' : '5+ Guests' },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => room.available && setSelectedRoom(room.id)}
                      className={cn(
                        'border bg-surface-container-lowest overflow-hidden transition-all cursor-pointer',
                        selectedRoom === room.id ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant/20 hover:border-outline-variant/50',
                        !room.available && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-[160px] h-[120px] sm:h-auto flex-shrink-0 overflow-hidden relative">
                          <img src={room.image} alt={room.name[locale]} className="w-full h-full object-cover" />
                          {!room.available && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase text-error font-georgian">{t('res.unavailable')}</span>
                            </div>
                          )}
                          {selectedRoom === room.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-on-primary text-[12px]">check</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-1.5">
                            <h4 className="font-[EB_Garamond] text-[15px] font-medium text-primary">{room.name[locale]}</h4>
                            <div className="text-right">
                              <span className="font-[Hanken_Grotesk] text-[14px] font-bold text-primary">&#8382;{room.price}</span>
                              <span className="font-[Hanken_Grotesk] text-[9px] text-secondary block">{t('res.perNight')}</span>
                            </div>
                          </div>
                          <p className="font-[Hanken_Grotesk] text-[11px] leading-[1.5] text-secondary mb-2.5 font-georgian">{room.description[locale]}</p>
                          <div className="flex items-center gap-3 text-[10px] text-on-surface-variant mb-2">
                            <span className="flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">person</span>
                              {room.capacity}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">square_foot</span>
                              {room.size}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities[locale].slice(0, 4).map((a) => (
                              <span key={a} className="font-[Hanken_Grotesk] text-[9px] bg-surface-container px-1.5 py-0.5 text-secondary">{a}</span>
                            ))}
                            {room.amenities[locale].length > 4 && (
                              <span className="font-[Hanken_Grotesk] text-[9px] text-primary font-semibold px-1 py-0.5">+{room.amenities[locale].length - 4}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <div>
                  {selectedRoomData && nightCount > 0 && (
                    <div className="font-[Hanken_Grotesk] text-[12px] text-secondary font-georgian">
                      {t('res.total')}: <span className="text-primary font-bold text-[15px]">&#8382;{totalPrice}</span>
                      <span className="text-[10px] ml-1">({nightCount} {t('res.nights')})</span>
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
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
                <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian">{t('res.guestInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.firstName')} *</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.lastName')} *</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.email')} *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.phone')} *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+995 5XX XXX XXX" className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors placeholder:text-outline" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.country')}</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block font-georgian">{t('res.specialRequests')}</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder={t('res.specialRequestsPlaceholder')} rows={2} className="w-full bg-transparent border-b border-outline py-1.5 font-[Hanken_Grotesk] text-[13px] outline-none focus:border-primary transition-colors resize-none placeholder:text-outline" />
                  </div>
                </div>
              </div>

              {selectedRoomData && (
                <div className="bg-surface-container-low border border-outline-variant/20 p-4">
                  <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-2 font-georgian">{t('res.summary')}</h4>
                  <div className="flex items-center gap-3">
                    <img src={selectedRoomData.image} alt="" className="w-12 h-12 object-cover" />
                    <div className="flex-1">
                      <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary">{selectedRoomData.name[locale]}</p>
                      <p className="font-[Hanken_Grotesk] text-[10px] text-secondary">
                        {checkIn && format(checkIn, 'd MMM', { locale: dateLocale })} — {checkOut && format(checkOut, 'd MMM', { locale: dateLocale })} &middot; {nightCount} {t('res.nights')}
                      </p>
                    </div>
                    <span className="font-[Hanken_Grotesk] text-[14px] font-bold text-primary">&#8382;{totalPrice}</span>
                  </div>
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

          {step === 3 && selectedRoomData && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant/20 p-5">
                <h3 className="font-[EB_Garamond] text-[16px] font-medium text-primary mb-5 font-georgian">{t('res.summary')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-[Hanken_Grotesk] text-[10px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant mb-3 font-georgian">{t('res.roomDetails')}</h4>
                    <div className="flex gap-3 mb-3">
                      <img src={selectedRoomData.image} alt="" className="w-20 h-16 object-cover" />
                      <div>
                        <p className="font-[EB_Garamond] text-[14px] font-medium text-primary">{selectedRoomData.name[locale]}</p>
                        <p className="font-[Hanken_Grotesk] text-[10px] text-secondary mt-0.5">{selectedRoomData.size} &middot; {t('res.capacity')}: {selectedRoomData.capacity}</p>
                      </div>
                    </div>
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
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.firstName')}</span><span className="text-primary font-semibold">{firstName}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.lastName')}</span><span className="text-primary font-semibold">{lastName}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.email')}</span><span className="text-primary font-semibold">{email}</span></div>
                      <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.phone')}</span><span className="text-primary font-semibold">{phone}</span></div>
                      {country && <div className="flex justify-between"><span className="text-secondary font-georgian">{t('res.country')}</span><span className="text-primary font-semibold">{country}</span></div>}
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

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant font-georgian">
                  <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                  {t('res.back')}
                </button>
                <button onClick={() => setStep(4)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  {t('res.confirm')}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-14">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h2 className="font-[EB_Garamond] text-[22px] text-primary mb-2 font-georgian">{t('res.success')}</h2>
              <p className="font-[Hanken_Grotesk] text-[12px] text-secondary mb-6 font-georgian">{t('res.successDesc')}</p>
              <Link to="/" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-on-primary font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian">
                <span className="material-symbols-outlined text-[13px]">home</span>
                {t('res.backToHome')}
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-6 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-3 px-6 max-w-[1280px] mx-auto">
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
