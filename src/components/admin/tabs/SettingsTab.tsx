import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { api } from '../../../../convex/_generated/api'
import { SiteSettingsForm } from '@/components/admin/SiteSettingsForm'
import { GalleryTab } from '@/components/admin/tabs/GalleryTab'
import { SponsorsTab } from '@/components/admin/tabs/SponsorsTab'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'

type SubTab = 'general' | 'gallery' | 'sponsors'

/**
 * Settings hub. Hosts:
 *
 *  - Account row at the top: Language toggle + Sign out (with confirmation).
 *  - Sub-tab strip: General · Gallery · Sponsors. Selecting Gallery or
 *    Sponsors navigates to that admin tab via the URL so deep-linking still
 *    works and the page label in the top bar updates.
 *
 * The sub-tabs render the existing tab components inline so administrators
 * can manage everything from one consolidated screen.
 */
export function SettingsTab() {
  const { locale, setLocale, t } = useI18n()
  const { logout, sessionToken } = useAdminAuth()
  const logoutMutation = useMutation(api.auth.logout)

  // Sub-tab is purely local state — Settings is the only top-level tab in
  // play. Gallery and Sponsors no longer have their own bottom-nav buttons,
  // so we keep them inline here without changing the URL.
  const [subTab, setSubTab] = useState<SubTab>('general')
  const [signOutOpen, setSignOutOpen] = useState(false)

  // Honor a `#sub=gallery|sponsors|general` fragment on first paint so old
  // gallery/sponsors deep links still open the right inner section after the
  // layout redirects them here.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = /sub=(general|gallery|sponsors)/.exec(window.location.hash)
    if (m && (m[1] === 'general' || m[1] === 'gallery' || m[1] === 'sponsors')) {
      setSubTab(m[1])
    }
    // Run only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const subTabs: { key: SubTab; icon: string; label: string }[] = [
    {
      key: 'general',
      icon: 'tune',
      label: locale === 'ka' ? 'ზოგადი' : locale === 'ru' ? 'Общие' : 'General',
    },
    {
      key: 'gallery',
      icon: 'photo_library',
      label: locale === 'ka' ? 'გალერეა' : locale === 'ru' ? 'Галерея' : 'Gallery',
    },
    {
      key: 'sponsors',
      icon: 'handshake',
      label: locale === 'ka' ? 'პარტნიორები' : locale === 'ru' ? 'Партнеры' : 'Sponsors',
    },
  ]

  const handleConfirmLogout = async () => {
    if (sessionToken) {
      try {
        await logoutMutation({ sessionToken })
      } catch {
        // Even if the server call fails (already-expired token, etc.) we
        // still want to clear local state and navigate away.
      }
    }
    setSignOutOpen(false)
    logout() // navigates to /admin/login
  }

  // Optional convenience: when user opens "Gallery" or "Sponsors" inside
  // Settings, just switch the local sub-tab — no URL change needed.
  const handleSubTabClick = (key: SubTab) => {
    setSubTab(key)
  }

  return (
    <div className="space-y-6 sm:space-y-8 mt-2 sm:mt-4">
      {/* Account row — language + sign out */}
      <section>
        <h3 className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant mb-3">
          {locale === 'ka' ? 'ანგარიში' : locale === 'ru' ? 'Аккаунт' : 'Account'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Language */}
          <button
            type="button"
            onClick={() => {
              if (locale === 'ka') setLocale('en')
              else if (locale === 'en') setLocale('ru')
              else setLocale('ka')
            }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-sm border border-outline-variant/30 bg-surface-container-lowest hover:border-primary/30 transition-colors text-left"
          >
            <span
              className="material-symbols-outlined text-[20px] text-primary"
              aria-hidden="true"
            >
              translate
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface">
                {locale === 'ka' ? 'ენა' : locale === 'ru' ? 'Язык' : 'Language'}
              </div>
              <div className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant">
                {locale === 'ka' ? 'ქართული' : locale === 'ru' ? 'Русский' : 'English'} ·{' '}
                <span className="text-primary font-semibold">
                  {locale === 'ka'
                    ? 'შეცვლა → English'
                    : locale === 'en'
                    ? 'Switch → Русский'
                    : 'Переключить → ქართული'}
                </span>
              </div>
            </div>
            <span
              className="material-symbols-outlined text-[18px] text-on-surface-variant"
              aria-hidden="true"
            >
              chevron_right
            </span>
          </button>

          {/* Sign out */}
          <button
            type="button"
            onClick={() => setSignOutOpen(true)}
            className="flex items-center gap-3 px-4 py-3.5 rounded-sm border border-outline-variant/30 bg-surface-container-lowest hover:border-error/40 transition-colors text-left group"
          >
            <span
              className="material-symbols-outlined text-[20px] text-error"
              aria-hidden="true"
            >
              logout
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface group-hover:text-error transition-colors">
                {t('admin.sidebar.logout')}
              </div>
              <div className="font-[Hanken_Grotesk] text-[11px] text-on-surface-variant">
                {locale === 'ka'
                  ? 'სესიის დასრულება'
                  : locale === 'ru'
                  ? 'Завершить сессию администратора'
                  : 'End your admin session'}
              </div>
            </div>
            <span
              className="material-symbols-outlined text-[18px] text-on-surface-variant"
              aria-hidden="true"
            >
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Sub-tab strip — General / Gallery / Sponsors */}
      <div className="border-b border-outline-variant/30 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
        <div
          role="tablist"
          aria-label="Settings sections"
          className="flex items-center gap-1 min-w-max"
        >
          {subTabs.map((s) => {
            const isActive = subTab === s.key
            return (
              <button
                key={s.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSubTabClick(s.key)}
                className={[
                  'flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap',
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/30',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {s.icon}
                </span>
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active sub-tab content */}
      <div>
        {subTab === 'general' && (
          <div>
            <div className="mb-6">
              <h3 className="font-[EB_Garamond] text-[22px] sm:text-[28px] text-primary">
                {t('admin.settings.title')}
              </h3>
              <p className="font-[Hanken_Grotesk] text-[12px] sm:text-[13px] text-on-surface-variant mt-1">
                {t('admin.settings.subtitle')}
              </p>
            </div>
            <SiteSettingsForm />
          </div>
        )}
        {subTab === 'gallery' && <GalleryTab />}
        {subTab === 'sponsors' && <SponsorsTab />}
      </div>

      {/* Sign-out confirmation */}
      <ConfirmationDialog
        isOpen={signOutOpen}
        title={locale === 'ka' ? 'გასვლა' : locale === 'ru' ? 'Выйти' : 'Sign out'}
        description={
          locale === 'ka'
            ? 'ნამდვილად გსურთ ადმინიდან გამოსვლა?'
            : locale === 'ru'
            ? 'Вы действительно хотите выйти из панели управления?'
            : 'Are you sure you want to sign out of the admin panel?'
        }
        onConfirm={() => void handleConfirmLogout()}
        onCancel={() => setSignOutOpen(false)}
        confirmLabel={t('admin.sidebar.logout')}
        cancelLabel={locale === 'ka' ? 'არა, უკან' : locale === 'ru' ? 'Нет, назад' : 'No, go back'}
        tone="destructive"
        icon="logout"
      />
    </div>
  )
}
