import { useState, useCallback, useRef, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'
import { BlurhashImage } from '@/components/BlurhashImage'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const Route = createFileRoute('/gallery')({
  head: () => ({
    meta: [
      {
        title: 'გალერეა — Gallery | Kai Hotel Bar',
      },
      {
        name: 'description',
        content: 'View photos of Kai Hotel Bar Tbilisi — rooms, terrace, balcony, garden, and hotel facilities. Economy, Twin, Deluxe, Triple & Dorm rooms. See what awaits you.',
      },
      {
        name: 'keywords',
        content: 'Kai Hotel photos, hotel gallery, სასტუმრო ფოტოები, hotel images Georgia',
      },
    ],
  }),
  component: GalleryPage,
})

/**
 * Assigns a span pattern to each image so the CSS grid looks like a
 * natural collage — no two adjacent images have the same shape.
 * Pattern cycles through: tall, square, wide, square, square, tall, …
 */
function getSpan(index: number): string {
  const patterns = [
    'row-span-2',          // tall
    '',                    // square
    'col-span-2',          // wide
    '',                    // square
    '',                    // square
    'row-span-2',          // tall
    '',                    // square
    'col-span-2 row-span-2', // big
    '',                    // square
    '',                    // square
  ]
  return patterns[index % patterns.length]
}

function GalleryPage() {
  const { locale } = useI18n()
  const galleryImages = useQuery(api.gallery.list) ?? []
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = useCallback(() =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null,
    ), [galleryImages.length])
  const next = useCallback(() =>
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % galleryImages.length : null,
    ), [galleryImages.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, prev, next])

  // Preload adjacent lightbox images for instant navigation
  const preloadRef = useRef<HTMLLinkElement[]>([])
  useEffect(() => {
    // Clean up previous preloads
    preloadRef.current.forEach((link) => link.remove())
    preloadRef.current = []

    if (lightboxIndex === null || galleryImages.length <= 1) return

    const adjacentIndices = [
      (lightboxIndex + 1) % galleryImages.length,
      (lightboxIndex - 1 + galleryImages.length) % galleryImages.length,
    ]

    adjacentIndices.forEach((idx) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.as = 'image'
      link.href = galleryImages[idx].imageUrl
      document.head.appendChild(link)
      preloadRef.current.push(link)
    })

    return () => {
      preloadRef.current.forEach((link) => link.remove())
      preloadRef.current = []
    }
  }, [lightboxIndex, galleryImages])

  return (
    <>
      <Navbar />

      <main>
        {/* Page Header */}
        <section className="pt-24 sm:pt-32 pb-8 sm:pb-10 px-4 sm:px-8 max-w-[1280px] mx-auto border-b border-outline-variant/20">
          <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.4em] text-primary block mb-3">
            {locale === 'ka' ? 'პერსპექტივა' : 'Perspective'}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <h1 className="font-[EB_Garamond] text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] text-primary">
              {locale === 'ka' ? 'ვიზუალური პოეზია' : 'Visual Poetry'}
            </h1>
            {galleryImages.length > 0 && (
              <span className="font-[Hanken_Grotesk] text-[12px] text-secondary sm:pb-2 shrink-0">
                {galleryImages.length} {locale === 'ka' ? 'სურათი' : 'images'}
              </span>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section className="py-8 sm:py-10 px-3 sm:px-4 md:px-8 max-w-[1280px] mx-auto">
          {galleryImages.length > 0 ? (
            <>
              {/* Mobile: simple 2-col uniform grid */}
              <div className="grid grid-cols-2 gap-2 md:hidden">
                {galleryImages.map((img) => (
                  <div
                    key={img._id}
                    className="aspect-square overflow-hidden cursor-pointer group relative"
                    onClick={() => setLightboxIndex(galleryImages.indexOf(img))}
                  >
                    <BlurhashImage
                      className="w-full h-full"
                      src={img.imageUrl}
                      alt={img.altText}
                      blurhash={img.blurhash}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">zoom_in</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: collage grid with varied spans */}
              <div
                className="hidden md:grid gap-2"
                style={{ gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px' }}
              >
                {galleryImages.map((img, idx) => {
                  const span = getSpan(idx)
                  return (
                    <div
                      key={img._id}
                      className={`overflow-hidden cursor-pointer group relative ${span}`}
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <BlurhashImage
                        className="w-full h-full"
                        src={img.imageUrl}
                        alt={img.altText}
                        blurhash={img.blurhash}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">zoom_in</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="py-24 text-center border border-outline-variant/20 bg-surface-container-low">
              <span className="material-symbols-outlined text-[40px] text-secondary/30 block mb-5">
                photo_library
              </span>
              <p className="font-[EB_Garamond] text-[22px] text-primary mb-2">
                {locale === 'ka' ? 'გალერეა მალე დაემატება' : 'Gallery Coming Soon'}
              </p>
              <p className="font-[Hanken_Grotesk] text-[13px] text-secondary max-w-xs mx-auto">
                {locale === 'ka'
                  ? 'ჩვენ ვმუშაობთ სურათების დამატებაზე. მალე დაბრუნდით.'
                  : 'We are curating our gallery. Check back soon.'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>

          {galleryImages.length > 1 && (
            <button
              className="absolute left-4 md:left-8 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-[36px]">chevron_left</span>
            </button>
          )}

          <div
            className="max-w-[88vw] max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex].imageUrl}
              alt={galleryImages[lightboxIndex].altText}
              className="max-w-full max-h-[88vh] object-contain"
            />
            {galleryImages[lightboxIndex].altText && (
              <p className="font-[Hanken_Grotesk] text-[12px] text-white/50 mt-3 text-center">
                {galleryImages[lightboxIndex].altText}
              </p>
            )}
          </div>

          {galleryImages.length > 1 && (
            <button
              className="absolute right-4 md:right-8 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-[36px]">chevron_right</span>
            </button>
          )}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-[Hanken_Grotesk] text-[11px] text-white/40 tracking-widest">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
