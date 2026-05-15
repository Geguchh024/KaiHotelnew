import { useState, memo } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'

export const Navbar = memo(function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/rooms', label: t('nav.rooms') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-[1280px] mx-auto">
        <Link to="/" className="font-[EB_Garamond] text-[22px] sm:text-[24px] leading-[1.3] text-primary font-medium">
          Kai Hotel Bar
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-[Hanken_Grotesk] text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-300 ${
                location.pathname === link.to
                  ? 'text-primary border-b border-primary pb-0.5'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
            className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2 sm:px-2.5 py-1.5 rounded-sm"
          >
            {locale === 'ka' ? 'EN' : 'ქარ'}
          </button>
          <Link
            to="/reservations"
            className="hidden sm:inline-block bg-primary text-on-primary px-5 py-2 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity"
          >
            {t('nav.bookNow')}
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-primary"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/20 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.05em] py-3 border-b border-outline-variant/10 transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 bg-primary text-on-primary px-5 py-2.5 font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] hover:opacity-90 transition-opacity text-center"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
})
