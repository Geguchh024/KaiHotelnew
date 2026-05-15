import { memo } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useI18n } from '@/lib/i18n'

export const Footer = memo(function Footer() {
  const { t, locale } = useI18n()
  const siteSettings = useQuery(api.siteSettings.get)
  const sponsors = useQuery(api.sponsors.list) ?? []

  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-lowest">
      {/* Partners */}
      {sponsors.length > 0 && (
        <div className="py-10 border-b border-outline-variant/20">
          <div className="px-6 max-w-[1280px] mx-auto">
            <h3 className="font-[EB_Garamond] text-[18px] text-primary text-center mb-6">
              {t('footer.partners')}
            </h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor._id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-[Hanken_Grotesk] text-[13px] text-secondary hover:text-primary transition-colors"
                >
                  {sponsor.logoUrl && (
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="h-5 w-auto object-contain" loading="lazy" decoding="async" />
                  )}
                  {sponsor.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main footer */}
      <div className="py-10 sm:py-12 px-4 sm:px-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {/* Brand & About */}
          <div>
            <Link to="/" className="font-[EB_Garamond] text-[20px] font-medium text-primary block mb-3">
              Kai Hotel Bar
            </Link>
            {locale === 'ka' && siteSettings?.aboutKa && (
              <p className="font-[Hanken_Grotesk] text-[13px] text-secondary leading-[1.6]">
                {siteSettings.aboutKa}
              </p>
            )}
            {locale === 'en' && siteSettings?.aboutEn && (
              <p className="font-[Hanken_Grotesk] text-[13px] text-secondary leading-[1.6]">
                {siteSettings.aboutEn}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-primary mb-4">
              {t('nav.contact')}
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-[16px]">call</span>
                <a
                  href={`tel:${siteSettings?.phone ?? '+995511222028'}`}
                  className="font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors"
                >
                  {siteSettings?.phone ?? t('footer.phone')}
                </a>
              </div>
              {siteSettings?.email && (
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <a href={`mailto:${siteSettings.email}`} className="font-[Hanken_Grotesk] text-[13px] hover:text-primary transition-colors">
                    {siteSettings.email}
                  </a>
                </div>
              )}
              {(siteSettings?.addressKa || siteSettings?.addressEn) && (
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span className="font-[Hanken_Grotesk] text-[13px]">
                    {locale === 'ka' ? siteSettings?.addressKa : siteSettings?.addressEn}
                  </span>
                </div>
              )}
              {siteSettings?.facebookUrl && (
                <a
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mt-1"
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="font-[Hanken_Grotesk] text-[13px]">Facebook</span>
                </a>
              )}
              {siteSettings?.instagramUrl && (
                <a
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span className="font-[Hanken_Grotesk] text-[13px]">Instagram</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-outline-variant/20 text-center">
          <p className="font-[Hanken_Grotesk] text-[12px] text-secondary/60">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
})
