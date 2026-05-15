import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/seo-dev')({
  component: SeoDevPanel,
})

// ─── All SEO data — sourced from booking-com-2026-05-15.csv + coordinates ─────

const SITE_URL = 'https://hotel.kai.com.ge'

const pages = [
  {
    route: '/',
    label: 'Homepage',
    title: 'Kai Hotel Bar Tbilisi | სასტუმრო თბილისში — From ₾33/night',
    description:
      'Kai Hotel Bar Tbilisi, Didube — rooms from ₾33/night. Economy, Twin, Deluxe, Triple & Dorm. Free Wi-Fi, AC, terrace, balcony. Free cancellation, pay at property.',
    keywords:
      'Kai Hotel Tbilisi, Kai Hotel Bar, hotel Tbilisi, სასტუმრო თბილისი, hotel Didube Tbilisi, cheap hotel Tbilisi, hotel near metro Tbilisi, accommodation Tbilisi Georgia, hostel Tbilisi',
  },
  {
    route: '/rooms',
    label: 'Rooms',
    title: 'ნომრები — Rooms | Kai Hotel Bar Tbilisi | From ₾33/night',
    description:
      'Kai Hotel Bar Tbilisi rooms from ₾33/night. Economy Double ₾82, Twin with Terrace ₾96, Deluxe ₾90, Triple ₾94, Dorm ₾33. AC, Free Wi-Fi, balcony, flat-screen TV in all rooms.',
    keywords:
      'Kai Hotel rooms Tbilisi, hotel rooms Tbilisi, ნომრები თბილისი, economy room Tbilisi, twin room Tbilisi, dorm Tbilisi, cheap room Tbilisi Georgia',
  },
  {
    route: '/reservations',
    label: 'Book a Room',
    title: 'დაჯავშნე — Book | Kai Hotel Bar Tbilisi | Free Cancellation',
    description:
      'Book Kai Hotel Bar Tbilisi from ₾33/night. Free cancellation, no credit card needed, pay at property. Economy, Twin, Deluxe, Triple & Dorm rooms. Best rate direct.',
    keywords:
      'book hotel Tbilisi, Kai Hotel reservation, დაჯავშნე თბილისი, free cancellation hotel Tbilisi, no prepayment hotel Georgia, hotel booking Tbilisi',
  },
  {
    route: '/gallery',
    label: 'Gallery',
    title: 'გალერეა — Gallery | Kai Hotel Bar Tbilisi',
    description:
      'View photos of Kai Hotel Bar Tbilisi — rooms, terrace, balcony, garden, and hotel facilities. Economy, Twin, Deluxe, Triple & Dorm rooms. See what awaits you.',
    keywords: 'Kai Hotel photos, hotel gallery, სასტუმრო ფოტოები, hotel images Georgia',
  },
  {
    route: '/contact',
    label: 'Contact',
    title: 'კონტაქტი — Contact | Kai Hotel Bar Tbilisi',
    description:
      'Contact Kai Hotel Bar — 24 Samtredia Street, Didube, Tbilisi 0119. Phone: +995 511 222 028. Near metro station. Send us a message for reservations or inquiries.',
    keywords:
      'Kai Hotel contact, hotel Tbilisi phone, სასტუმრო კონტაქტი თბილისი, 24 Samtredia Street Tbilisi, Kai Hotel address',
  },
]

const globalMeta = {
  siteName: 'Kai Hotel Bar',
  siteUrl: SITE_URL,
  defaultTitle: 'Kai Hotel Bar | სასტუმრო თბილისში — Hotel & Bar in Tbilisi, Georgia',
  defaultDescription:
    'Kai Hotel Bar — სასტუმრო თბილისში, 24 სამტრედიის ქ., დიდუბე. ნომრები ₾33-დან, უფასო Wi-Fi, პარკინგი, ტერასა, ბალკონი. უფასო გაუქმება. Hotel in Tbilisi from ₾33/night. Free cancellation.',
  ogTitle: 'Kai Hotel Bar Tbilisi — Rooms from ₾33/night | Free Cancellation',
  ogDescription:
    'Hotel & Bar in Tbilisi, Didube. Economy, Twin, Deluxe & Dorm rooms. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct for best rate.',
  ogImage: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop',
  twitterTitle: 'Kai Hotel Bar Tbilisi — From ₾33/night | Free Cancellation',
  twitterDescription:
    'Hotel & Bar in Tbilisi, Didube. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct.',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  geoRegion: 'GE-TB',
  geoPlacename: 'Tbilisi',
  geoPosition: '41.742438;44.775813',
  language: 'Georgian, English',
  canonical: SITE_URL,
  hreflang: ['ka → ' + SITE_URL, 'en → ' + SITE_URL, 'x-default → ' + SITE_URL],
}

// Room data extracted from booking-com-2026-05-15.csv
const rooms = [
  { name: 'Economy Double Room', beds: '1 large double bed', size: '16 m²', maxPersons: 2, price: 82, originalPrice: 82, amenities: 'City/Garden/Courtyard view, Soundproofing, AC, Balcony, TV, Terrace, Free WiFi, Ensuite bathroom, Free toiletries, Washing machine, Bath/shower, Linen' },
  { name: 'Twin Room with Terrace', beds: '2 single beds', size: '20 m²', maxPersons: 2, price: 96, originalPrice: 113, amenities: 'City/Garden/Courtyard view, Soundproofing, AC, Balcony, TV, Terrace, Free WiFi, Ensuite bathroom, Free toiletries, Washing machine, Bath/shower, Linen' },
  { name: 'Deluxe Double Room', beds: '2 single beds', size: '20 m²', maxPersons: 2, price: 90, originalPrice: 106, amenities: 'AC, Balcony, TV, Terrace, Free WiFi, Private bathroom' },
  { name: 'Standard Triple Room', beds: '3 single beds', size: '15 m²', maxPersons: 2, price: 94, originalPrice: 111, amenities: 'City/Garden/Courtyard view, Soundproofing, AC, Balcony, TV, Terrace, Free WiFi, Ensuite bathroom, Free toiletries, Washing machine, Bath/shower, Linen' },
  { name: 'Mixed Dormitory Room', beds: '4 bunk beds', size: '20 m²', maxPersons: 1, price: 33, originalPrice: 33, amenities: 'AC, Balcony, TV, Terrace, Free WiFi' },
]

const structuredData = {
  hotel: {
    type: 'Hotel (schema.org)',
    name: 'Kai Hotel Bar',
    url: SITE_URL,
    telephone: '+995511222028',
    email: 'info@kai.com.ge',
    address: '24 Samtredia Street, Didube, Tbilisi 0119, GE',
    geo: '41.742438, 44.775813',
    priceRange: '₾33 - ₾113',
    currencies: 'GEL',
    payment: 'Cash — Pay at property. No credit card needed.',
    starRating: '4',
    aggregateRating: 'Google: 3.4 / 5 (35 reviews) · Booking.com: 7.5 / 10 (260 reviews)',
    checkin: '12:00',
    checkout: '12:00',
    petsAllowed: 'No',
    languages: 'Georgian, English, Russian',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Balcony', 'Terrace', 'Flat-screen TV', 'Airport Shuttle', 'Free Parking', '24-Hour Reception', 'Non-Smoking Rooms', 'Family Rooms', 'Bar', 'Washing Machine', 'Free Toiletries', 'Soundproofing'],
    bookingUrl: SITE_URL + '/reservations',
    sameAs: 'https://www.booking.com/hotel/ge/kai-t-39-bilisi1.en-gb.html',
  },
  localBusiness: {
    type: 'LodgingBusiness (schema.org)',
    name: 'Kai Hotel Bar',
    id: SITE_URL,
    url: SITE_URL,
    telephone: '+995511222028',
    address: '24 Samtredia Street, Didube, Tbilisi 0119, GE',
    geo: '41.742438, 44.775813',
    hours: 'Open 24/7 (00:00 – 23:59, all days)',
    priceRange: '₾33 - ₾113',
  },
  breadcrumbs: [
    { position: 1, name: 'Home', url: SITE_URL + '/' },
    { position: 2, name: 'Rooms', url: SITE_URL + '/rooms' },
    { position: 3, name: 'Book Now', url: SITE_URL + '/reservations' },
    { position: 4, name: 'Gallery', url: SITE_URL + '/gallery' },
    { position: 5, name: 'Contact', url: SITE_URL + '/contact' },
  ],
}

const sitemap = [
  { url: SITE_URL + '/', changefreq: 'weekly', priority: '1.0' },
  { url: SITE_URL + '/rooms', changefreq: 'weekly', priority: '0.9' },
  { url: SITE_URL + '/reservations', changefreq: 'daily', priority: '0.9' },
  { url: SITE_URL + '/gallery', changefreq: 'weekly', priority: '0.7' },
  { url: SITE_URL + '/contact', changefreq: 'monthly', priority: '0.6' },
]

const checklist = [
  { done: true, item: 'robots.txt — admin blocked, sitemap linked' },
  { done: true, item: 'sitemap.xml — all 5 pages with hreflang' },
  { done: true, item: 'Canonical URLs → hotel.kai.com.ge' },
  { done: true, item: 'Hreflang tags (ka, en, x-default)' },
  { done: true, item: 'Open Graph tags (og:title, og:description, og:image)' },
  { done: true, item: 'Twitter Card tags' },
  { done: true, item: 'JSON-LD: Hotel schema with real address & coordinates' },
  { done: true, item: 'JSON-LD: LodgingBusiness schema' },
  { done: true, item: 'JSON-LD: BreadcrumbList schema' },
  { done: true, item: 'Geo meta tags — GE-TB, Tbilisi, 41.742438;44.775813' },
  { done: true, item: 'Address: 24 Samtredia Street, Didube, Tbilisi 0119' },
  { done: true, item: 'Price range updated: ₾33 – ₾113 (from CSV)' },
  { done: true, item: 'Room types from CSV: Economy, Twin, Deluxe, Triple, Dorm' },
  { done: true, item: 'Payment: Cash, pay at property, no credit card needed' },
  { done: true, item: '⚠ Aggregate rating — Google: 3.4/5 (35 reviews), Booking.com: 7.5/10 (260 reviews) ✓ confirmed' },
  { done: true, item: 'Check-in/out times — both 12:00 ✓ confirmed' },
  { done: true, item: 'OG image — Unsplash placeholder (intentional, keeping as-is)' },
  { done: false, item: 'Google Tag Manager — add GTM-XXXXXXX container ID in __root.tsx' },
  { done: false, item: 'Google Site Verification — add verification meta tag' },
  { done: false, item: 'Google Ads conversion tracking on /reservations/confirmation/' },
  { done: false, item: 'Submit sitemap to Google Search Console' },
]

// ─── UI Components ────────────────────────────────────────────────────────────

function Field({ label, value, mono = false, warn = false }: {
  label: string; value: string | string[]; mono?: boolean; warn?: boolean
}) {
  const text = Array.isArray(value) ? value.join('\n') : value
  const charCount = typeof value === 'string' ? value.length : null
  const tooLong = warn && charCount !== null && charCount > 160
  const tooShort = warn && charCount !== null && charCount < 50

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        {charCount !== null && (
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${tooLong ? 'bg-red-900/40 text-red-300' : tooShort ? 'bg-yellow-900/40 text-yellow-300' : 'bg-slate-700 text-slate-400'}`}>
            {charCount} chars
          </span>
        )}
      </div>
      <div className={`text-[13px] leading-relaxed p-3 rounded border bg-slate-800/60 whitespace-pre-wrap ${mono ? 'font-mono text-[11px]' : ''} ${tooLong || tooShort ? 'border-yellow-600/50' : 'border-slate-700'}`}>
        {text}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 pb-2 border-b border-slate-700">{title}</h3>
      {children}
    </div>
  )
}

type Tab = 'pages' | 'rooms' | 'global' | 'structured' | 'sitemap' | 'checklist'

function SeoDevPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('pages')
  const [activePage, setActivePage] = useState(0)

  if (import.meta.env.PROD) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 font-mono text-sm">
        SEO Dev Panel is only available in development mode.
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pages', label: 'Page Meta' },
    { id: 'rooms', label: 'Room Data' },
    { id: 'global', label: 'Global Meta' },
    { id: 'structured', label: 'Structured Data' },
    { id: 'sitemap', label: 'Sitemap' },
    { id: 'checklist', label: 'Checklist' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/95 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded">DEV ONLY</span>
            <h1 className="text-[16px] font-semibold text-white">SEO Review Panel</h1>
            <span className="text-[12px] text-slate-500">hotel.kai.com.ge · Tbilisi, Georgia</span>
          </div>
          <a href="/" className="text-[11px] text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded">← Back to site</a>
        </div>
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-[12px] font-medium px-4 py-2.5 border-b-2 transition-colors ${activeTab === tab.id ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* ── PAGE META ── */}
        {activeTab === 'pages' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-6">Title: 50–60 chars ideal. Description: 120–160 chars ideal. Check the Google preview below.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {pages.map((p, i) => (
                <button key={p.route} onClick={() => setActivePage(i)}
                  className={`text-[12px] px-4 py-2 rounded border transition-colors ${activePage === i ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}>
                  {p.label} <span className="ml-1 text-slate-500 font-mono text-[10px]">{p.route}</span>
                </button>
              ))}
            </div>
            {(() => {
              const page = pages[activePage]
              return (
                <div>
                  <Section title="Google Search Preview">
                    <div className="bg-white rounded-lg p-5 mb-3">
                      <div className="text-[12px] text-slate-500 mb-1">{SITE_URL}{page.route}</div>
                      <div className="text-[20px] text-blue-700 leading-snug mb-1">{page.title.length > 60 ? page.title.slice(0, 60) + '…' : page.title}</div>
                      <div className="text-[14px] text-slate-600 leading-snug">{page.description.length > 160 ? page.description.slice(0, 160) + '…' : page.description}</div>
                    </div>
                    {page.title.length > 60 && <p className="text-[11px] text-red-400 mb-1">⚠ Title is {page.title.length} chars — Google truncates at ~60.</p>}
                    {page.description.length > 160 && <p className="text-[11px] text-yellow-400 mb-1">⚠ Description is {page.description.length} chars — Google truncates at ~160.</p>}
                    {page.title.length <= 60 && <p className="text-[11px] text-emerald-400 mb-1">✓ Title length OK ({page.title.length} chars)</p>}
                    {page.description.length <= 160 && page.description.length >= 120 && <p className="text-[11px] text-emerald-400 mb-1">✓ Description length OK ({page.description.length} chars)</p>}
                  </Section>
                  <Section title="Raw Values">
                    <Field label="Title" value={page.title} warn />
                    <Field label="Description" value={page.description} warn />
                    <Field label="Keywords" value={page.keywords} />
                  </Section>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── ROOM DATA ── */}
        {activeTab === 'rooms' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-2">Sourced from <code className="bg-slate-800 px-1 rounded text-emerald-400">booking-com-2026-05-15.csv</code> — scraped 15 May 2026.</p>
            <p className="text-[12px] text-slate-400 mb-6">All rooms include: Free cancellation before 17 May 2026 · Pay at property · No credit card needed · Breakfast optional +₾10</p>
            <div className="space-y-4">
              {rooms.map((room) => (
                <div key={room.name} className="border border-slate-700 rounded-lg p-4 bg-slate-800/40">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-white">{room.name}</h3>
                      <p className="text-[12px] text-slate-400 mt-0.5">{room.beds} · {room.size} · Max {room.maxPersons} person{room.maxPersons > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[18px] font-bold text-emerald-400">₾{room.price}</div>
                      {room.originalPrice !== room.price && (
                        <div className="text-[11px] text-slate-500 line-through">₾{room.originalPrice}</div>
                      )}
                      <div className="text-[10px] text-slate-500">/ night</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{room.amenities}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded">
              <p className="text-[12px] text-slate-300"><span className="text-emerald-400 font-semibold">Price range in SEO:</span> ₾33 – ₾113 (dorm to twin with terrace at full price)</p>
              <p className="text-[12px] text-slate-300 mt-1"><span className="text-yellow-400 font-semibold">Note:</span> Prices shown are for 1 night, 2 adults, May 20–21 2026. Some rooms have 15% Getaway Deal discount applied.</p>
            </div>
          </div>
        )}

        {/* ── GLOBAL META ── */}
        {activeTab === 'global' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-6">Set in <code className="bg-slate-800 px-1 rounded text-emerald-400">__root.tsx</code> — applies to every page as fallback.</p>
            <Section title="Site Identity">
              <Field label="Site Name" value={globalMeta.siteName} />
              <Field label="Site URL (Canonical)" value={globalMeta.siteUrl} mono />
              <Field label="Robots" value={globalMeta.robots} mono />
              <Field label="Language" value={globalMeta.language} />
            </Section>
            <Section title="Default Title & Description (fallback)">
              <Field label="Default Title" value={globalMeta.defaultTitle} warn />
              <Field label="Default Description" value={globalMeta.defaultDescription} warn />
            </Section>
            <Section title="Open Graph (Facebook / Google Display Ads)">
              <div className="bg-slate-800 rounded-lg overflow-hidden mb-4 max-w-sm">
                <img src={globalMeta.ogImage} alt="OG preview" className="w-full h-40 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div className="p-3">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">hotel.kai.com.ge</div>
                  <div className="text-[14px] font-semibold text-white leading-snug mb-1">{globalMeta.ogTitle}</div>
                  <div className="text-[12px] text-slate-400 leading-snug">{globalMeta.ogDescription}</div>
                </div>
              </div>
              <p className="text-[11px] text-yellow-400 mb-3">⚠ OG image is a placeholder (Unsplash). Replace with a real hotel photo for Google Ads.</p>
              <Field label="og:title" value={globalMeta.ogTitle} warn />
              <Field label="og:description" value={globalMeta.ogDescription} warn />
              <Field label="og:image URL" value={globalMeta.ogImage} mono />
              <Field label="og:image size" value="1200 × 630 px" />
            </Section>
            <Section title="Twitter Card">
              <Field label="twitter:title" value={globalMeta.twitterTitle} warn />
              <Field label="twitter:description" value={globalMeta.twitterDescription} warn />
            </Section>
            <Section title="Geo Tags (Tbilisi)">
              <Field label="geo.region" value={globalMeta.geoRegion} />
              <Field label="geo.placename" value={globalMeta.geoPlacename} />
              <Field label="geo.position / ICBM" value={globalMeta.geoPosition} mono />
            </Section>
            <Section title="Hreflang (Bilingual SEO)">
              <Field label="Alternate Links" value={globalMeta.hreflang} mono />
            </Section>
          </div>
        )}

        {/* ── STRUCTURED DATA ── */}
        {activeTab === 'structured' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-6">JSON-LD injected into every page. Powers Google rich results, hotel cards, and local pack.</p>
            <Section title={`1. ${structuredData.hotel.type}`}>
              {Object.entries(structuredData.hotel).map(([key, val]) =>
                key !== 'type' && (
                  <div key={key} className="flex gap-4 py-2 border-b border-slate-800 last:border-0">
                    <span className="text-[11px] font-mono text-slate-500 w-36 shrink-0">{key}</span>
                    <span className={`text-[12px] ${String(val).includes('⚠') ? 'text-yellow-400' : 'text-slate-200'}`}>
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                )
              )}
            </Section>
            <Section title={`2. ${structuredData.localBusiness.type}`}>
              {Object.entries(structuredData.localBusiness).map(([key, val]) =>
                key !== 'type' && (
                  <div key={key} className="flex gap-4 py-2 border-b border-slate-800 last:border-0">
                    <span className="text-[11px] font-mono text-slate-500 w-36 shrink-0">{key}</span>
                    <span className="text-[12px] text-slate-200">{String(val)}</span>
                  </div>
                )
              )}
            </Section>
            <Section title="3. BreadcrumbList (schema.org)">
              <div className="flex flex-wrap gap-2">
                {structuredData.breadcrumbs.map((b, i) => (
                  <div key={b.position} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-600">›</span>}
                    <div className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5">
                      <span className="text-[10px] text-slate-500 mr-1">{b.position}.</span>
                      <span className="text-[12px] text-slate-200">{b.name}</span>
                      <span className="text-[10px] text-slate-500 ml-1 font-mono">{b.url.replace(SITE_URL, '')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* ── SITEMAP ── */}
        {activeTab === 'sitemap' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-6">Located at <code className="bg-slate-800 px-1 rounded text-emerald-400">public/sitemap.xml</code></p>
            <Section title="Sitemap Entries">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 pr-6 text-slate-400 font-medium">URL</th>
                    <th className="text-left py-2 pr-6 text-slate-400 font-medium">Change Freq</th>
                    <th className="text-left py-2 text-slate-400 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {sitemap.map((entry) => (
                    <tr key={entry.url} className="border-b border-slate-800">
                      <td className="py-3 pr-6 font-mono text-emerald-400">{entry.url}</td>
                      <td className="py-3 pr-6 text-slate-300">{entry.changefreq}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${entry.priority === '1.0' ? 'bg-emerald-500/20 text-emerald-400' : entry.priority === '0.9' ? 'bg-blue-500/20 text-blue-400' : entry.priority === '0.7' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>
                          {entry.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
            <Section title="robots.txt">
              <pre className="text-[12px] font-mono bg-slate-800 border border-slate-700 rounded p-4 text-slate-300">{`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /admin\nDisallow: /api/\nSitemap: https://hotel.kai.com.ge/sitemap.xml`}</pre>
            </Section>
          </div>
        )}

        {/* ── CHECKLIST ── */}
        {activeTab === 'checklist' && (
          <div>
            <p className="text-[12px] text-slate-400 mb-6">Google Ads & SEO readiness. Green = done, red = needs action.</p>
            <div className="space-y-2 mb-8">
              {checklist.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded border ${item.done ? 'border-emerald-800/50 bg-emerald-900/10' : 'border-red-800/50 bg-red-900/10'}`}>
                  <span className={`text-[16px] mt-0.5 shrink-0 ${item.done ? 'text-emerald-400' : 'text-red-400'}`}>{item.done ? '✓' : '✗'}</span>
                  <span className={`text-[13px] ${item.done ? 'text-slate-300' : 'text-slate-200'}`}>{item.item}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-800 border border-slate-700 rounded">
              <h4 className="text-[12px] font-bold text-white mb-3">Next Steps for Google Ads</h4>
              <ol className="space-y-2 text-[12px] text-slate-300 list-decimal list-inside">
                <li>Create Google Tag Manager account → get GTM-XXXXXXX ID</li>
                <li>Uncomment GTM script in <code className="text-emerald-400">src/routes/__root.tsx</code></li>
                <li>Add Google Site Verification meta tag (from Search Console)</li>
                <li>Submit <code className="text-emerald-400">https://hotel.kai.com.ge/sitemap.xml</code> to Google Search Console</li>
                <li>Set up conversion event in GTM for <code className="text-emerald-400">/reservations/confirmation/</code></li>
                <li>Replace Unsplash OG image with a real hotel photo (1200×630px)</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
