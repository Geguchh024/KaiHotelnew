import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomSelect } from '@/components/ui/custom-select'
import { BlurhashImage } from '@/components/BlurhashImage'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { addDays, format } from 'date-fns'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Kai Hotel Bar Tbilisi | სასტუმრო თბილისში — From ₾33/night',
      },
      {
        name: 'description',
        content: 'Kai Hotel Bar Tbilisi, Didube — from ₾33/night. Economy, Twin, Deluxe, Triple & Dorm. Free Wi-Fi, AC, terrace, balcony. Free cancellation, pay at property.',
      },
      {
        name: 'keywords',
        content: 'Kai Hotel Tbilisi, Kai Hotel Bar, hotel Tbilisi, სასტუმრო თბილისი, hotel Didube Tbilisi, cheap hotel Tbilisi, hotel near metro Tbilisi, accommodation Tbilisi Georgia, hostel Tbilisi',
      },
    ],
  }),
  component: Home,
})

function Home() {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState('2')

  const rooms = useQuery(api.rooms.list) ?? []
  const galleryImages = useQuery(api.gallery.list) ?? []

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full ken-burns">
              <BlurhashImage
                src="https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1258&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Kai Hotel"
                blurhash="LkH^woxCI=sn}ls,R.sm^LoIR-n%"
                className="w-full h-full"
                priority
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/70"></div>
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl">
            <span className="hero-rise hero-rise-1 font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 block mb-3 sm:mb-4">
              {t('hero.welcome')}
            </span>
            <h1 className="hero-rise hero-rise-2 font-[EB_Garamond] text-[28px] sm:text-[36px] md:text-[48px] leading-[1.15] tracking-[-0.01em] text-white mb-3 sm:mb-4">
              {t('hero.title')}
            </h1>
            <p className="hero-rise hero-rise-3 font-[Hanken_Grotesk] text-[13px] sm:text-[15px] leading-[1.5] text-white/80 max-w-xl mx-auto mb-6 sm:mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="hero-rise hero-rise-4 flex justify-center gap-3 flex-wrap">
              <Link to="/rooms" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:bg-white/20 hover:scale-[1.02] transition-all duration-300">
                {t('hero.exploreRooms')}
              </Link>
              <Link to="/contact" className="bg-white text-primary px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 hover:scale-[1.02] transition-all duration-300">
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </section>

        {/* Booking Bar */}
        <section className="no-contain relative z-20 -mt-12 px-4 sm:px-6 max-w-[1080px] mx-auto overflow-visible">
          <Reveal className="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-6 md:p-8 shadow-sm overflow-visible">
            <h3 className="font-[EB_Garamond] text-[18px] font-medium text-primary mb-5">
              {t('booking.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end overflow-visible">
              <DatePicker
                value={checkIn}
                onChange={(date) => {
                  setCheckIn(date)
                  if (checkOut && date >= checkOut) {
                    setCheckOut(null)
                  }
                }}
                placeholder={t('booking.selectDate')}
                locale={locale}
                icon="calendar_today"
                label={t('booking.checkin')}
                minDate={new Date()}
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
              <div className="space-y-1.5">
                <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block opacity-0">
                  &nbsp;
                </label>
                <button
                  onClick={() => {
                    const search: Record<string, string> = {}
                    if (checkIn) search.checkIn = format(checkIn, 'yyyy-MM-dd')
                    if (checkOut) search.checkOut = format(checkOut, 'yyyy-MM-dd')
                    if (guests !== '2') search.guests = guests
                    void navigate({ to: '/reservations', search })
                  }}
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 hover:scale-[1.02] transition-all duration-300 text-center w-full"
                >
                  {t('nav.bookNow')}
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Rooms Preview */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1280px] mx-auto">
          <Reveal className="text-center mb-12">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
              {t('rooms.label')}
            </span>
            <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary">
              {t('rooms.title')}
            </h2>
            <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto">
              {t('rooms.description')}
            </p>
          </Reveal>

          {rooms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {rooms.slice(0, 3).map((room, i) => (
                  <Reveal
                    key={room._id}
                    delay={((i % 3) + 1) as 1 | 2 | 3}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                      <BlurhashImage
                        className="w-full h-full img-zoom"
                        src={room.imageUrl}
                        alt={locale === 'ka' ? room.nameKa : room.nameEn}
                        blurhash={room.blurhash}
                      />
                    </div>
                    <h3 className="font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1 group-hover:text-primary-container transition-colors duration-300">
                      {locale === 'ka' ? room.nameKa : room.nameEn}
                    </h3>
                    <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary">
                      {locale === 'ka' ? room.descriptionKa : room.descriptionEn}
                    </p>
                    <p className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary mt-2">
                      ${Math.round(room.pricePerNight)} / {locale === 'ka' ? 'ღამე' : 'night'} · {room.capacity} {locale === 'ka' ? 'სტუმარი' : 'guests'}
                    </p>
                  </Reveal>
                ))}
              </div>
              {rooms.length > 3 && (
                <div className="text-center mt-8">
                  <Link
                    to="/rooms"
                    className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-6 py-2.5 hover:bg-primary hover:text-on-primary transition-all duration-300"
                  >
                    {t('rooms.viewAll')}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-secondary/40 block mb-4">
                bed
              </span>
              <p className="font-[Hanken_Grotesk] text-[15px] text-secondary">
                {locale === 'ka' ? 'ნომრები მალე დაემატება' : 'Rooms coming soon'}
              </p>
            </div>
          )}
        </section>

        {/* Amenities Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-surface-container-low">
          <div className="px-4 sm:px-6 max-w-[1280px] mx-auto">
            <Reveal className="text-center mb-12">
              <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
                {t('amenities.label')}
              </span>
              <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary">
                {t('amenities.title')}
              </h2>
              <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto">
                {t('amenities.description')}
              </p>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { icon: 'wifi', label: t('amenities.wifi') },
                { icon: 'airport_shuttle', label: t('amenities.shuttle') },
                { icon: 'local_parking', label: t('amenities.parking') },
                { icon: 'family_restroom', label: t('amenities.family') },
                { icon: 'smoke_free', label: t('amenities.nonSmoking') },
                { icon: 'concierge', label: t('amenities.reception') },
                { icon: 'deck', label: t('amenities.terrace') },
                { icon: 'yard', label: t('amenities.garden') },
              ].map((amenity, i) => (
                <Reveal
                  key={amenity.icon}
                  delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                  className="flex flex-col items-center gap-2.5 p-5 bg-surface-container-lowest border border-outline-variant/20 lift hover:shadow-md hover:border-primary/30"
                >
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {amenity.icon}
                  </span>
                  <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary text-center">
                    {amenity.label}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 max-w-[1280px] mx-auto">
          <Reveal className="text-center mb-12">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
              {t('reviews.label')}
            </span>
            <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary">
              {t('reviews.title')}
            </h2>
            <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto">
              {t('reviews.description')}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { nameKey: 'reviews.review1.name', countryKey: 'reviews.review1.country', textKey: 'reviews.review1.text' },
              { nameKey: 'reviews.review2.name', countryKey: 'reviews.review2.country', textKey: 'reviews.review2.text' },
              { nameKey: 'reviews.review3.name', countryKey: 'reviews.review3.country', textKey: 'reviews.review3.text' },
            ].map((review, i) => (
              <Reveal
                key={i}
                delay={((i % 3) + 1) as 1 | 2 | 3}
                className="p-6 bg-surface-container-lowest border border-outline-variant/20 lift hover:shadow-md hover:border-primary/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                  </div>
                  <div>
                    <h4 className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary">
                      {t(review.nameKey)}
                    </h4>
                    <span className="font-[Hanken_Grotesk] text-[11px] text-secondary">
                      {t(review.countryKey)}
                    </span>
                  </div>
                </div>
                <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary">
                  "{t(review.textKey)}"
                </p>
                <div className="flex gap-0.5 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="py-12 sm:py-16 md:py-20 bg-surface-container-low overflow-hidden">
          <Reveal as="div" className="px-4 sm:px-6 max-w-[1280px] mx-auto mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
                {locale === 'ka' ? 'გალერეა' : 'Gallery'}
              </span>
              <h2 className="font-[EB_Garamond] text-[24px] sm:text-[28px] md:text-[36px] leading-[1.2] text-primary">
                Kai Hotel
              </h2>
            </div>
            {galleryImages.length > 0 && (
              <Link
                to="/gallery"
                className="font-[Hanken_Grotesk] text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border border-primary px-3 sm:px-5 py-2 hover:bg-primary hover:text-on-primary transition-all duration-300 shrink-0"
              >
                {locale === 'ka' ? 'სრული გალერეა' : 'View All'}
              </Link>
            )}
          </Reveal>

          {galleryImages.length > 0 ? (
            <Reveal className="px-4 sm:px-6 max-w-[1280px] mx-auto">
              {/* Mobile: 2-col uniform grid */}
              <div className="grid grid-cols-2 gap-2 md:hidden">
                {galleryImages.slice(0, 4).map((img) => (
                  <div key={img._id} className="aspect-square overflow-hidden group">
                    <BlurhashImage className="w-full h-full img-zoom" src={img.imageUrl} alt={img.altText} blurhash={img.blurhash} />
                  </div>
                ))}
              </div>

              {/* Desktop: editorial collage */}
              <div
                className="hidden md:grid gap-2"
                style={{ gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '220px 220px' }}
              >
                {/* Left — tall, spans 2 rows */}
                <div className="row-span-2 overflow-hidden group">
                  {galleryImages[0] && (
                    <BlurhashImage className="w-full h-full img-zoom" src={galleryImages[0].imageUrl} alt={galleryImages[0].altText} blurhash={galleryImages[0].blurhash} />
                  )}
                </div>
                {/* Top middle */}
                <div className="overflow-hidden group">
                  {galleryImages[1] && (
                    <BlurhashImage className="w-full h-full img-zoom" src={galleryImages[1].imageUrl} alt={galleryImages[1].altText} blurhash={galleryImages[1].blurhash} />
                  )}
                </div>
                {/* Top right */}
                <div className="overflow-hidden group">
                  {galleryImages[2] && (
                    <BlurhashImage className="w-full h-full img-zoom" src={galleryImages[2].imageUrl} alt={galleryImages[2].altText} blurhash={galleryImages[2].blurhash} />
                  )}
                </div>
                {/* Bottom — spans 2 cols */}
                <div className="col-span-2 overflow-hidden group">
                  {galleryImages[3] && (
                    <BlurhashImage className="w-full h-full img-zoom" src={galleryImages[3].imageUrl} alt={galleryImages[3].altText} blurhash={galleryImages[3].blurhash} />
                  )}
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="px-4 sm:px-6 max-w-[1280px] mx-auto text-center py-12">
              <span className="material-symbols-outlined text-[48px] text-secondary/40 block mb-4">
                photo_library
              </span>
              <p className="font-[Hanken_Grotesk] text-[15px] text-secondary">
                {locale === 'ka' ? 'გალერეა მალე დაემატება' : 'Gallery coming soon'}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
