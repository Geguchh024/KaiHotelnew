import { useState } from 'react'
import { createPortal } from 'react-dom'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Doc } from '../../convex/_generated/dataModel'
import { useI18n } from '@/lib/i18n'
import { BlurhashImage } from '@/components/BlurhashImage'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Route = createFileRoute('/rooms')({
  head: () => ({
    meta: [
      {
        title: 'ნომრები — Rooms | Kai Hotel Bar Tbilisi | From ₾33/night',
      },
      {
        name: 'description',
        content: 'Kai Hotel Bar Tbilisi rooms from ₾33/night. Economy ₾82, Twin ₾96, Deluxe ₾90, Triple ₾94, Dorm ₾33. AC, Free Wi-Fi, balcony, flat-screen TV in all rooms.',
      },
      {
        name: 'keywords',
        content: 'Kai Hotel rooms Tbilisi, hotel rooms Tbilisi, ნომრები თბილისი, economy room Tbilisi, twin room Tbilisi, dorm Tbilisi, cheap room Tbilisi Georgia',
      },
    ],
  }),
  component: RoomsPage,
})

type Room = Doc<'rooms'>

// ─── Room Detail Modal ────────────────────────────────────────────────────────
function RoomModal({ room, onClose, locale }: { room: Room; onClose: () => void; locale: string }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl mx-4">
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden relative">
          <BlurhashImage
            className="w-full h-full"
            src={room.imageUrl}
            alt={locale === 'ka' ? room.nameKa : room.nameEn}
            blurhash={room.blurhash}
          />
          {/* Close button over image */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white transition-colors p-1.5"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-5">
            <h2 className="font-[EB_Garamond] text-[22px] sm:text-[28px] leading-[1.2] text-primary">
              {locale === 'ka' ? room.nameKa : room.nameEn}
            </h2>
            <div className="text-right shrink-0">
              <p className="font-[Hanken_Grotesk] text-[15px] font-semibold text-primary">
                ${Math.round(room.pricePerNight)}
              </p>
              <p className="font-[Hanken_Grotesk] text-[11px] text-secondary">
                {locale === 'ka' ? '/ ღამე' : '/ night'}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="font-[Hanken_Grotesk] text-[14px] leading-[1.7] text-secondary mb-6">
            {locale === 'ka' ? room.descriptionKa : room.descriptionEn}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-6 pb-6 border-b border-outline-variant/20 mb-6">
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span className="font-[Hanken_Grotesk] text-[13px]">
                {room.capacity} {locale === 'ka' ? 'სტუმარი' : 'guests'}
              </span>
            </div>
          </div>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div className="mb-8">
              <h4 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-secondary mb-3">
                {locale === 'ka' ? 'სერვისები' : 'Amenities'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="font-[Hanken_Grotesk] text-[12px] text-on-surface border border-outline-variant/40 px-3 py-1.5"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/reservations"
              className="bg-primary text-on-primary px-8 py-2.5 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity"
              onClick={onClose}
            >
              {locale === 'ka' ? 'დაჯავშნე' : 'Book Now'}
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function RoomsPage() {
  const { t, locale } = useI18n()
  const rooms = useQuery(api.rooms.list) ?? []
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  return (
    <>
      <Navbar />

      <main>
        {/* Page Header */}
        <section className="pt-24 sm:pt-32 pb-8 sm:pb-10 px-4 sm:px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20">
          <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3">
            {t('rooms.label')}
          </span>
          <h1 className="font-[EB_Garamond] text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] text-primary">
            {locale === 'ka' ? 'ჩვენი ნომრები' : 'The Suite Collection'}
          </h1>
        </section>

        {/* Intro */}
        <section className="py-8 sm:py-10 px-4 sm:px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20">
          <p className="font-[Hanken_Grotesk] text-[15px] leading-[1.7] text-secondary max-w-2xl">
            {t('rooms.description')}
          </p>
        </section>

        {/* Rooms grid */}
        <section className="py-10 sm:py-16 px-4 sm:px-8 max-w-[1280px] mx-auto">
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  {/* 4:3 image — less tall than before */}
                  <div className="aspect-[4/3] overflow-hidden mb-5 relative">
                    <BlurhashImage
                      className="w-full h-full"
                      src={room.imageUrl}
                      alt={locale === 'ka' ? room.nameKa : room.nameEn}
                      blurhash={room.blurhash}
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-end p-5">
                      <span className="font-[Hanken_Grotesk] text-white text-[11px] font-semibold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {locale === 'ka' ? 'დეტალების ნახვა' : 'View Details'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-[EB_Garamond] text-[20px] leading-[1.3] text-primary mb-1.5">
                    {locale === 'ka' ? room.nameKa : room.nameEn}
                  </h3>
                  <p className="font-[Hanken_Grotesk] text-[13px] leading-[1.6] text-secondary mb-4 line-clamp-2">
                    {locale === 'ka' ? room.descriptionKa : room.descriptionEn}
                  </p>

                  <div className="flex justify-between items-center border-t border-outline-variant/30 pt-3">
                    <span className="font-[Hanken_Grotesk] text-[13px] font-semibold text-primary">
                      ${Math.round(room.pricePerNight)}
                      <span className="font-normal text-secondary ml-1">
                        / {locale === 'ka' ? 'ღამე' : 'night'}
                      </span>
                    </span>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[15px]">person</span>
                      <span className="font-[Hanken_Grotesk] text-[12px]">
                        {room.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-outline-variant/20 bg-surface-container-low">
              <span className="material-symbols-outlined text-[40px] text-secondary/30 block mb-5">bed</span>
              <p className="font-[EB_Garamond] text-[22px] text-primary mb-2">
                {locale === 'ka' ? 'ნომრები მალე დაემატება' : 'Rooms Coming Soon'}
              </p>
              <p className="font-[Hanken_Grotesk] text-[13px] text-secondary max-w-xs mx-auto">
                {locale === 'ka'
                  ? 'ჩვენ ვმუშაობთ ნომრების დამატებაზე. მალე დაბრუნდით.'
                  : 'We are working on adding our rooms. Check back soon.'}
              </p>
            </div>
          )}
        </section>

        {/* Amenities strip */}
        <section className="py-10 sm:py-14 bg-surface-container-low border-y border-outline-variant/20">
          <div className="px-4 sm:px-8 max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="md:w-56 shrink-0">
                <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-2">
                  {t('amenities.label')}
                </span>
                <h2 className="font-[EB_Garamond] text-[26px] leading-[1.2] text-primary">
                  {t('amenities.title')}
                </h2>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: 'wifi', label: t('amenities.wifi') },
                  { icon: 'airport_shuttle', label: t('amenities.shuttle') },
                  { icon: 'local_parking', label: t('amenities.parking') },
                  { icon: 'family_restroom', label: t('amenities.family') },
                  { icon: 'smoke_free', label: t('amenities.nonSmoking') },
                  { icon: 'concierge', label: t('amenities.reception') },
                  { icon: 'deck', label: t('amenities.terrace') },
                  { icon: 'yard', label: t('amenities.garden') },
                ].map((a) => (
                  <div key={a.icon} className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">{a.icon}</span>
                    <span className="font-[Hanken_Grotesk] text-[12px] text-on-surface">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-20 px-4 sm:px-8 max-w-[1280px] mx-auto text-center">
          <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-4">
            {locale === 'ka' ? 'დაჯავშნეთ' : 'Reserve'}
          </span>
          <h2 className="font-[EB_Garamond] text-[28px] sm:text-[32px] md:text-[40px] text-primary mb-4 sm:mb-6">
            {locale === 'ka' ? 'მოამზადეთ თქვენი ვიზიტი' : 'Plan Your Stay'}
          </h2>
          <p className="font-[Hanken_Grotesk] text-[14px] text-secondary max-w-md mx-auto mb-8">
            {locale === 'ka'
              ? 'დაჯავშნეთ ნომერი პირდაპირ ჩვენს საიტზე საუკეთესო ფასად.'
              : 'Book directly with us for the best rate.'}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/reservations"
              className="bg-primary text-on-primary px-10 py-3 font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* Room detail modal */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          locale={locale}
        />
      )}
    </>
  )
}
