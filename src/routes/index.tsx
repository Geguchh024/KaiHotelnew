import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'
import { DatePicker } from '@/components/ui/date-picker'
import { CustomSelect } from '@/components/ui/custom-select'
import { addDays } from 'date-fns'

export const Route = createFileRoute('/')({
  component: Home,
})

// Example cancelled/unavailable dates (these would come from your backend)
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

function Home() {
  const { t, locale, setLocale } = useI18n()
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [guests, setGuests] = useState('2')
  const [roomType, setRoomType] = useState('standard')

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
        <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
          <div className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium">
            Kai Hotel Bar
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-primary border-b border-primary pb-0.5" href="#rooms">
              {t('nav.rooms')}
            </a>
            <a className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300" href="#amenities">
              {t('nav.amenities')}
            </a>
            <a className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300" href="#reviews">
              {t('nav.reviews')}
            </a>
            <a className="font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors duration-300" href="#contact">
              {t('nav.contact')}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
              className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2.5 py-1.5 rounded-sm"
            >
              {locale === 'ka' ? 'EN' : 'ქარ'}
            </button>
            <Link
              to="/reservations"
              className="bg-primary text-on-primary px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY9QA6hdujx9v5PKnWGRYe9QZHD82dOu2rzlpL-yfp13_NTFUA1Cx8HAQ4MgmKdFyEayOJGAXT6YJUgB54roBl7EW3A67I-BsGG8t4dQioJ7D16Uv9cH3c8PeWlWIuk_dbc_eMHCBTSVnmcEgIqokO9O6bJdpAI562Msej8LrzMfutunkGo96mY5yNdQ0hMkapfrKBP9lYQ8mxosI3S9HzTwFL0BTxxn4evm6ql1yhJvOMRQ7bf59EdU35ZppXeWsIn8rzQS1x-A"
              alt="Kai Hotel"
            />
            <div className="absolute inset-0 bg-primary/30 backdrop-brightness-75"></div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 block mb-4">
              {t('hero.welcome')}
            </span>
            <h1 className="font-[EB_Garamond] text-[32px] md:text-[48px] leading-[1.15] tracking-[-0.01em] text-white mb-4 font-georgian">
              {t('hero.title')}
            </h1>
            <p className="font-[Hanken_Grotesk] text-[15px] leading-[1.5] text-white/80 max-w-xl mx-auto mb-8 font-georgian">
              {t('hero.subtitle')}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="#rooms" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:bg-white/20 transition-all font-georgian">
                {t('hero.exploreRooms')}
              </a>
              <a href="#amenities" className="bg-white text-primary px-6 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all font-georgian">
                {t('hero.viewAmenities')}
              </a>
            </div>
          </div>
        </section>

        {/* Booking Bar */}
        <section className="relative z-20 -mt-12 px-6 max-w-[1080px] mx-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 md:p-8 shadow-sm">
            <h3 className="font-[EB_Garamond] text-[18px] font-medium text-primary mb-5 font-georgian">
              {t('booking.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
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
              <CustomSelect
                value={roomType}
                onChange={setRoomType}
                icon="bed"
                label={t('booking.roomType')}
                options={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'deluxe', label: 'Deluxe' },
                  { value: 'family', label: locale === 'ka' ? 'საოჯახო' : 'Family Suite' },
                ]}
              />
              <div className="space-y-1.5">
                <label className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant block opacity-0">
                  &nbsp;
                </label>
                <a
                  href="https://www.booking.com/Share-WUttkr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-all text-center font-georgian w-full"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  {t('booking.bookOnBooking')}
                </a>
              </div>
            </div>
            <p className="font-[Hanken_Grotesk] text-[12px] text-secondary mt-4 font-georgian">
              {t('booking.untilAvailable')}
            </p>
          </div>
        </section>

        {/* Rooms Section */}
        <section id="rooms" className="py-20 px-6 max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian">
              {t('rooms.label')}
            </span>
            <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian">
              {t('rooms.title')}
            </h2>
            <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian">
              {t('rooms.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNaQ2CxjWnz-SqNgtseplFra2Yklt2cRdneNh2Zcqdn7QTDTiRrIvURULn-c6VRACpvXxfGIZ6RC874Iqn5LyHDRBjb2sQxPbtXcuhwtEJgawbyUhL5rjh03Lv643X4-vnKWmCO13_NUz23A0aRZ3Gm5J5L76njpViRN6W25QoNjsGEVZ8W7mz1wfyoQndVnz7Lb0EAg3LHVts5IFQdz3VY6Uteu0ATIboZvb4WFmgP5Ksdn8RO6czc4RihFArthaaThRjX1mx6w"
                  alt="Standard Room"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]">
                    {t('rooms.viewAll')}
                  </span>
                </div>
              </div>
              <h3 className="font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1">
                Standard Room
              </h3>
              <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary">
                კომფორტული ნომერი ყველა საჭირო კეთილმოწყობით
              </p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdYLOCkbl4imubXOzryG3zZTarGntdjsdo_zIJBMXRQyL_1veF5CnAeOO2xqMsB6h2HIJmOEFAGIkviXG77q5DFO7tw5P4Fi8DynZeTLIUOm8M6Nwaq-safFuZ2gHra-Q45432Kye9ZiawpZV1MEOtxtaV-WKrzzV14Q9rWGICfLKR4ZWvD1YpNhuc8W7WqzLMt5Xc_t9GGc8b0x573ugqlhg-KYLlWxYUXoydOOTAUpugGpE6vlAsr0RLWpIqeC43WEgs5wKKoQ"
                  alt="Deluxe Room"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]">
                    {t('rooms.viewAll')}
                  </span>
                </div>
              </div>
              <h3 className="font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1">
                Deluxe Room
              </h3>
              <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary">
                გაფართოებული ნომერი ტერასით და ბაღის ხედით
              </p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXBHloncPNvIKTxdi_NpTFbcW72yA7Kmr4lPP32yovsRnqCmu2XmPehBmHkunI0E5sM4azooCY3hjOTzUOOFZ5M_XSHXfDrSjkyeCQhr53KxQJskol41bUtnFCPShUQ8lzoGLwXehhdj8jHmpPzbrrUPH5nCQJwmjkY6YORD3SLvYziYkjc3MjtG-KxJ439SN9BhDzknY5Ltk-8Dv36MdgjPMdzBPzE3KmQYLn8WfMMrqFr5UJIsz1Bu2N8go_an_uyh43llMMLQ"
                  alt="Family Suite"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.05em]">
                    {t('rooms.viewAll')}
                  </span>
                </div>
              </div>
              <h3 className="font-[EB_Garamond] text-[18px] leading-[1.3] font-medium text-primary mb-1">
                Family Suite
              </h3>
              <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.5] text-secondary">
                ფართო საოჯახო ნომერი ყველა კომფორტით
              </p>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="py-20 bg-surface-container-low">
          <div className="px-6 max-w-[1280px] mx-auto">
            <div className="text-center mb-12">
              <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian">
                {t('amenities.label')}
              </span>
              <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian">
                {t('amenities.title')}
              </h2>
              <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian">
                {t('amenities.description')}
              </p>
            </div>
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
              ].map((amenity) => (
                <div
                  key={amenity.icon}
                  className="flex flex-col items-center gap-2.5 p-5 bg-surface-container-lowest border border-outline-variant/20 hover:shadow-sm transition-shadow"
                >
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {amenity.icon}
                  </span>
                  <span className="font-[Hanken_Grotesk] text-[12px] font-semibold text-primary text-center font-georgian">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-20 px-6 max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2 font-georgian">
              {t('reviews.label')}
            </span>
            <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary font-georgian">
              {t('reviews.title')}
            </h2>
            <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.5] text-secondary mt-3 max-w-lg mx-auto font-georgian">
              {t('reviews.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nameKey: 'reviews.review1.name', countryKey: 'reviews.review1.country', textKey: 'reviews.review1.text' },
              { nameKey: 'reviews.review2.name', countryKey: 'reviews.review2.country', textKey: 'reviews.review2.text' },
              { nameKey: 'reviews.review3.name', countryKey: 'reviews.review3.country', textKey: 'reviews.review3.text' },
            ].map((review, i) => (
              <div
                key={i}
                className="p-6 bg-surface-container-lowest border border-outline-variant/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]">person</span>
                  </div>
                  <div>
                    <h4 className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary">
                      {t(review.nameKey)}
                    </h4>
                    <span className="font-[Hanken_Grotesk] text-[11px] text-secondary font-georgian">
                      {t(review.countryKey)}
                    </span>
                  </div>
                </div>
                <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary font-georgian">
                  "{t(review.textKey)}"
                </p>
                <div className="flex gap-0.5 mt-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-surface-container-low overflow-hidden">
          <div className="px-6 max-w-[1280px] mx-auto mb-10">
            <div className="text-center">
              <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
                გალერეა
              </span>
              <h2 className="font-[EB_Garamond] text-[28px] md:text-[36px] leading-[1.2] text-primary">
                Kai Hotel
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2 h-[400px]">
            <div className="h-full">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz8Bhtu4ra6R2aYKcVUSE8MqOqBX7gJ14ihQGtscSrJnbCYYA6V4Aef4Ho6-smBWkD9QO-MN5BjWyCWbugSNYcdP_W9M-6PB6lT8cAhhhFu8yDobWWxTBJNy6HBsn96xZh7O3AkLKUrFwmsuC7VHLn-9pP4j80WFxsZ1HOCLyD8PbMm3qqzZITqu07gXtVbTHNzkQhllTWe6Dz6ExnBneyfzy3Qj3VEPlcW_rMgf5r8K6mYXHOLI8wOBrAJdpeBq19L5FgkkKXrg"
                alt="Kai Hotel interior"
              />
            </div>
            <div className="grid grid-rows-2 gap-2 h-full">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqG7x2mzYA0kVVM6pOxKwaONl3S1donLNQGTZWYMRFi_CHOudZgpkZwtcIfOmcIyzZLvHHTakv5MYCG2ZoI6aE-qkpnwdpD2cdgz567SW6mEogsB2GtQKzlKJXfMNRz7cD_FNiVIWgC75f1_FTGUm3LTx1kmvj2TA0hmPkp1cCayNx_fGhfIWufvnlVRk-IIUyAgqV4UnM2_tVnrzghOZULiB4q0CyIKuMM2KVFQA2zCFS0ImStwDrcJeyQv8OM78a1I7UuHuf_Q"
                alt="Hotel view"
              />
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZSOPLDJr4PvQxqQGy6FL2JTOMELhffHKoiOreRMhkag9QwcjjnQSIPal3GIo6WyB6uzsrRSUuMRdc_cYp29_FCjY_t0eSX8Y4ae1i2m50YWumCfwf8OQgO5k_7NMZAhMCnXREnvDN1LHJ3ldbnbDsjVtv9Wp-PdbfUjHxTXFkYjv4gWvdV9UTjf0eapNyDZlSyx1ol2nsG2N1dxh0ZoyJ6tIJoFlzTVgpClhebz8OR9sClL2cEMA709098Q1LZh1wS9O9DzNEsw"
                alt="Hotel exterior"
              />
            </div>
            <div className="h-full">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnDfcr8nrtI5WpGUgBk5-08vv-qJdP7tXPphJ7K1HcnMdhJpAIM21Hyy3fzpfWaBlPSZ-slyE5YwuEPZKIEqqHwTI5vjHJn5iOxqSe8TFA1zlRM5tjBEiT6l0ujim-dQS19QzXTWVk9fxx5fhcoAH1wCPnmAwIl0xdaMk9W9RrZTbwH90ymEW8lhQUlnogYFhTbIix8kZ06Ieal15zTOIM1oyQBac5FgaJTvdd7eUiClXtwb--YcU5cHT9LXr29eer4_FPsDDwwg"
                alt="Surroundings"
              />
            </div>
            <div className="grid grid-rows-2 gap-2 h-full">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbEFdd1t5xWL4nQ5c0IBQ8-AWu4ob11nO7V2N3V9QoEOaSJG2cGEnzAXZzr61KhkpXvi81FEgO1yQO5K3cahlyGztY3sg9jEPHyK6M1mQbGWgs2xh80AIcTBEKCYWTJg2cqwTKbtFZGnu4ZSkKDIywJ_bjGAgqdJLAQpcXNnwPEH6cSioL6SeALV29f3fEBFkKVIY5CssgIq8LlVpfQpnddlaAzgzRMv-Z3PpQsMUNlUyIX34MuF_9uXwwV1dq4N9KbOg90MJUBg"
                alt="Restaurant"
              />
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABgVywaGP5P1KvCNVhlBSrFozsUMCnsLD16wE9BsKWlFTYmQ7wfpifdJMFR7oHKZheO9nWljPpyqYtLdJva95vVRKnBZkw_IY-LnDFjkn_n3zmukacg1sfrTiDg3tLXDiOqI3sVHzYDNF8jeLUxHWLxebFIweKHTgMXPRVIvHHuAxP2m9JFWfx3rMpb8qkC22rAufuGui7IP0UhI5lsRJDfbB6LYkO5ESRxL4ck2qdmPi2z2ZL5rQ6UShbOEmbeY_mWE7M4m2vNw"
                alt="Garden"
              />
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-14 px-6 max-w-[1280px] mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-[EB_Garamond] text-[20px] text-primary font-georgian">
              {t('footer.partners')}
            </h3>
          </div>
          <div className="flex justify-center items-center gap-10 flex-wrap">
            <a
              href="https://www.facebook.com/people/Chalet-Kazbegi/100057144592308/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors border border-outline-variant px-4 py-2"
            >
              Chalet Kazbegi
            </a>
            <a
              href="https://www.facebook.com/BabaneurisMarani/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors border border-outline-variant px-4 py-2"
            >
              ბაბანეურის მარანი
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="w-full py-12 border-t border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-6 px-6 max-w-[1280px] mx-auto">
          <div className="font-[EB_Garamond] text-[20px] font-medium text-primary">
            Kai Hotel Bar
          </div>
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-[16px]">call</span>
            <a
              href="tel:+995511222028"
              className="font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors"
            >
              {t('footer.phone')}
            </a>
          </div>
          <div className="flex gap-4">
            <a className="text-secondary hover:text-primary transition-colors" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a className="text-secondary hover:text-primary transition-colors" href="mailto:info@kai.com.ge">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
            <a className="text-secondary hover:text-primary transition-colors" href="tel:+995511222028">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </a>
          </div>
          <p className="font-[Hanken_Grotesk] text-[12px] text-secondary/60 font-georgian">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </>
  )
}
