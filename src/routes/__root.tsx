/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { I18nProvider } from '@/lib/i18n'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import '@/styles/globals.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

// Site-wide SEO constants
const SITE_NAME = 'Kai Hotel Bar'
const SITE_URL = 'https://hotel.kai.com.ge'
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kai Hotel Bar | სასტუმრო თბილისში — Hotel & Bar in Tbilisi, Georgia',
      },
      {
        name: 'description',
        content: 'Kai Hotel Bar — სასტუმრო თბილისში, 24 სამტრედიის ქ., დიდუბე. ნომრები ₾33-დან, უფასო Wi-Fi, პარკინგი, ტერასა, ბალკონი. უფასო გაუქმება. Hotel in Tbilisi from ₾33/night. Free cancellation.',
      },
      // SEO essentials
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: 'index, follow',
      },
      {
        name: 'author',
        content: 'Kai Hotel Bar',
      },
      {
        name: 'geo.region',
        content: 'GE-TB',
      },
      {
        name: 'geo.placename',
        content: 'Tbilisi',
      },
      {
        name: 'geo.position',
        content: '41.742438;44.775813',
      },
      {
        name: 'ICBM',
        content: '41.742438, 44.775813',
      },
      // Language alternates
      {
        name: 'language',
        content: 'Georgian, English',
      },
      // Open Graph (Facebook, Google Ads display)
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        property: 'og:title',
        content: 'Kai Hotel Bar Tbilisi — Rooms from ₾33/night | Free Cancellation',
      },
      {
        property: 'og:description',
        content: 'Hotel & Bar in Tbilisi, Didube. Economy, Twin, Deluxe & Dorm rooms. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct for best rate.',
      },
      {
        property: 'og:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:url',
        content: SITE_URL,
      },
      {
        property: 'og:locale',
        content: 'ka_GE',
      },
      {
        property: 'og:locale:alternate',
        content: 'en_US',
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Kai Hotel Bar Tbilisi — From ₾33/night | Free Cancellation',
      },
      {
        name: 'twitter:description',
        content: 'Hotel & Bar in Tbilisi, Didube. Free Wi-Fi, AC, terrace, balcony. No credit card needed. Book direct.',
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      // Google Ads conversion tracking placeholder
      // Replace with your actual Google Ads tag ID
      // { name: 'google-site-verification', content: 'YOUR_VERIFICATION_CODE' },
    ],
    links: [
      // Canonical URL
      {
        rel: 'canonical',
        href: SITE_URL,
      },
      // Hreflang for bilingual SEO (Georgian primary, English alternate)
      {
        rel: 'alternate',
        hrefLang: 'ka',
        href: SITE_URL,
      },
      {
        rel: 'alternate',
        hrefLang: 'en',
        href: SITE_URL,
      },
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: SITE_URL,
      },
      // DNS prefetch for external origins (B2 CDN, Unsplash, Convex)
      {
        rel: 'dns-prefetch',
        href: 'https://s3.eu-central-003.backblazeb2.com',
      },
      {
        rel: 'dns-prefetch',
        href: 'https://images.unsplash.com',
      },
      {
        rel: 'dns-prefetch',
        href: 'https://www.googletagmanager.com',
      },
      // Preconnect to font origins
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      // Preconnect to image CDN for faster first image load
      {
        rel: 'preconnect',
        href: 'https://s3.eu-central-003.backblazeb2.com',
      },
      // Font stylesheets with display=swap for non-blocking rendering
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Hanken+Grotesk:wght@400;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;600;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ConvexProvider client={convex}>
        <I18nProvider>
          <AdminAuthProvider>
            <Outlet />
          </AdminAuthProvider>
        </I18nProvider>
      </ConvexProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  // Hotel structured data for Google (JSON-LD)
  const hotelJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Kai Hotel Bar',
    description: 'Hotel & Bar in Tbilisi, Georgia. Rooms from ₾33/night — Economy Double, Twin with Terrace, Deluxe Double, Triple, and Dorm. Free Wi-Fi, AC, balcony, terrace. Free cancellation, no credit card needed. Book directly for the best rate.',
    url: 'https://hotel.kai.com.ge',
    telephone: '+995511222028',
    email: 'info@kai.com.ge',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '24 Samtredia Street',
      addressLocality: 'Tbilisi',
      addressRegion: 'Didube',
      postalCode: '0119',
      addressCountry: 'GE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.742438',
      longitude: '44.775813',
    },
    image: [
      'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop',
    ],
    priceRange: '₾33 - ₾113',
    currenciesAccepted: 'GEL',
    paymentAccepted: 'Cash — Pay at property, No credit card needed',
    starRating: {
      '@type': 'Rating',
      ratingValue: '4',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '3.4',
      reviewCount: '35',
      bestRating: '5',
      worstRating: '1',
      description: 'Google rating',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Balcony', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Terrace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Flat-screen TV', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Airport Shuttle', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24-Hour Reception', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Non-Smoking Rooms', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Family Rooms', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bar', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Washing Machine', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Free Toiletries', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Soundproofing', value: true },
    ],
    checkinTime: '12:00',
    checkoutTime: '12:00',
    petsAllowed: false,
    availableLanguage: [
      { '@type': 'Language', name: 'Georgian' },
      { '@type': 'Language', name: 'English' },
      { '@type': 'Language', name: 'Russian' },
    ],
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://hotel.kai.com.ge/reservations',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'LodgingReservation',
        name: 'Book a Room',
      },
    },
    sameAs: [
      'https://www.booking.com/hotel/ge/kai-t-39-bilisi1.en-gb.html',
    ],
  }

  // Local Business structured data for Google Maps / Local Pack
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Kai Hotel Bar',
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=1200&auto=format&fit=crop',
    '@id': 'https://hotel.kai.com.ge',
    url: 'https://hotel.kai.com.ge',
    telephone: '+995511222028',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '24 Samtredia Street',
      addressLocality: 'Tbilisi',
      addressRegion: 'Didube',
      postalCode: '0119',
      addressCountry: 'GE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.742438,
      longitude: 44.775813,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: '₾33 - ₾113',
  }

  // BreadcrumbList for sitelinks in Google
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hotel.kai.com.ge/' },
      { '@type': 'ListItem', position: 2, name: 'Rooms', item: 'https://hotel.kai.com.ge/rooms' },
      { '@type': 'ListItem', position: 3, name: 'Book Now', item: 'https://hotel.kai.com.ge/reservations' },
      { '@type': 'ListItem', position: 4, name: 'Gallery', item: 'https://hotel.kai.com.ge/gallery' },
      { '@type': 'ListItem', position: 5, name: 'Contact', item: 'https://hotel.kai.com.ge/contact' },
    ],
  }

  return (
    <html lang="ka" className="scroll-smooth">
      <head>
        <HeadContent />
        {/* Structured Data for Google / Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        {/* 
          Google Tag Manager — Replace GTM-XXXXXXX with your actual container ID.
          This enables Google Ads conversion tracking, remarketing, and analytics.
        */}
        {/* <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');` }} /> */}
      </head>
      <body className="bg-background text-on-surface">
        {/* Google Tag Manager (noscript) — uncomment when GTM is configured */}
        {/* <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript> */}
        {children}
        <Scripts />
      </body>
    </html>
  )
}
