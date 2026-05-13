import { Link, useLocation } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'

export function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/rooms', label: t('nav.rooms') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 backdrop-blur-md bg-background/80">
      <nav className="flex justify-between items-center px-6 py-4 max-w-[1280px] mx-auto">
        <Link to="/" className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary font-medium">
          Kai Hotel Bar
        </Link>
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
  )
}
