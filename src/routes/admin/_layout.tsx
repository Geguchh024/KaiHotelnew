import { Component, useEffect, useState, type ReactNode } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { ConvexError } from 'convex/values'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { AdminBottomNav } from '@/components/admin/AdminBottomNav'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AnalyticsTab } from '@/components/admin/tabs/AnalyticsTab'
import { RoomsTab } from '@/components/admin/tabs/RoomsTab'
import { GalleryTab } from '@/components/admin/tabs/GalleryTab'
import { SponsorsTab } from '@/components/admin/tabs/SponsorsTab'
import { MessagesTab } from '@/components/admin/tabs/MessagesTab'
import { SettingsTab } from '@/components/admin/tabs/SettingsTab'
import { ReservationsTab } from '@/components/admin/tabs/ReservationsTab'
import { useI18n } from '@/lib/i18n'
import { useIsDesktop } from '@/hooks/useMediaQuery'

const adminSearchSchema = z.object({
  tab: z
    .enum([
      'analytics',
      'rooms',
      'reservations',
      'gallery',
      'sponsors',
      'messages',
      'settings',
    ])
    .default('analytics'),
})

type AdminTab = z.infer<typeof adminSearchSchema>['tab']

export const Route = createFileRoute('/admin/_layout')({
  validateSearch: adminSearchSchema,
  component: AdminLayoutComponent,
})

// React error boundary for runtime errors
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class AdminErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      const isUnauthorized =
        (error instanceof ConvexError &&
          String(error.data).includes('Unauthorized')) ||
        (error instanceof Error && error.message.includes('Unauthorized'))

      if (isUnauthorized) {
        throw error
      }

      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
          <span className="material-symbols-outlined text-[48px] text-error/60">
            error
          </span>
          <p className="font-[EB_Garamond] text-[24px] text-primary">
            Something went wrong
          </p>
          <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface-variant">
            {error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

class AuthErrorBoundary extends Component<
  { children: ReactNode; onUnauthorized: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; onUnauthorized: () => void }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown) {
    const isUnauthorized =
      (error instanceof ConvexError &&
        String(error.data).includes('Unauthorized')) ||
      (error instanceof Error && error.message.includes('Unauthorized'))
    if (isUnauthorized) {
      this.props.onUnauthorized()
    }
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error
      const isUnauthorized =
        (error instanceof ConvexError &&
          String(error.data).includes('Unauthorized')) ||
        (error instanceof Error && error.message.includes('Unauthorized'))

      if (isUnauthorized) {
        return null // Will redirect shortly
      }

      // If it is another type of error, render a full page error boundary fallback
      return (
        <div className="flex flex-col items-center justify-center min-h-screen py-24 gap-4 text-center px-6 bg-background">
          <span className="material-symbols-outlined text-[48px] text-error/60">
            error
          </span>
          <p className="font-[EB_Garamond] text-[24px] text-primary">
            Something went wrong
          </p>
          <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface-variant">
            {error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const TAB_COMPONENTS: Record<AdminTab, () => React.JSX.Element> = {
  analytics: AnalyticsTab,
  rooms: RoomsTab,
  reservations: ReservationsTab,
  gallery: GalleryTab,
  sponsors: SponsorsTab,
  messages: MessagesTab,
  settings: SettingsTab,
}

function AdminLayoutComponent() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const { logout } = useAdminAuth()

  useEffect(() => {
    const token = localStorage.getItem('adminSessionToken')
    if (!token) {
      setIsAuthed(false)
      void navigate({
        to: '/admin/login',
        search: { redirect: window.location.pathname + window.location.search },
      })
    } else {
      setIsAuthed(true)
    }
  }, [navigate])

  // Gallery and Sponsors are no longer first-class destinations — they live
  // inside the Settings hub. Bookmarks and old links land us here, so we
  // bounce them to the Settings tab and surface the right sub-tab via a
  // hash fragment that SettingsTab reads on mount.
  useEffect(() => {
    if (tab === 'gallery' || tab === 'sponsors') {
      const sub = tab
      void navigate({
        to: '/admin',
        search: (prev) => ({ ...prev, tab: 'settings' }),
        hash: `sub=${sub}`,
        replace: true,
      })
    }
  }, [tab, navigate])

  const handleUnauthorized = () => {
    localStorage.removeItem('adminSessionToken')
    logout()
  }

  if (!isAuthed) return null

  const TabComponent = TAB_COMPONENTS[tab]

  return (
    <AuthErrorBoundary onUnauthorized={handleUnauthorized}>
      <div className="min-h-screen bg-background lg:pl-72">
        {/* Desktop sidebar — visible on lg+, fixed at the left edge */}
        <AdminSidebar activeTab={tab} />

        {/* Top app bar — mobile only; on desktop the sidebar already labels
            the active section so a duplicate top bar would be redundant. */}
        <AdminTopBar activeTab={tab} />

        <main
          className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-[64px] sm:pt-[72px] lg:pt-8 lg:pb-12"
          style={
            isDesktop
              ? undefined
              : {
                  // Reserve space for the mobile bottom nav. On desktop the
                  // sidebar layout uses Tailwind's lg:pb-12 instead.
                  paddingBottom:
                    'calc(env(safe-area-inset-bottom, 0px) + 88px)',
                }
          }
        >
          {/* Inner content rail — keeps line lengths comfortable on very
              wide screens without clipping when the sidebar takes its 256px. */}
          <div className="w-full max-w-[1440px] mx-auto">
            <AdminErrorBoundary>
              <TabComponent />
            </AdminErrorBoundary>
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <AdminBottomNav activeTab={tab} />
      </div>
    </AuthErrorBoundary>
  )
}

// ─── Top app bar ───────────────────────────────────────────────────────────

const TAB_LABELS: Record<AdminTab, { ka: string; en: string; ru: string; icon: string }> = {
  analytics: { ka: 'მთავარი', en: 'Dashboard', ru: 'Панель управления', icon: 'dashboard' },
  rooms: { ka: 'ნომრები', en: 'Rooms', ru: 'Номера', icon: 'bed' },
  reservations: { ka: 'ჯავშნები', en: 'Bookings', ru: 'Бронирования', icon: 'event_available' },
  gallery: { ka: 'გალერეა', en: 'Gallery', ru: 'Галерея', icon: 'photo_library' },
  sponsors: { ka: 'პარტნიორები', en: 'Sponsors', ru: 'Партнеры', icon: 'handshake' },
  messages: { ka: 'შეტყობინებები', en: 'Messages', ru: 'Сообщения', icon: 'mail' },
  settings: { ka: 'პარამეტრები', en: 'Settings', ru: 'Настройки', icon: 'settings' },
}

function AdminTopBar({ activeTab }: { activeTab: AdminTab }) {
  const { locale } = useI18n()
  const meta = TAB_LABELS[activeTab]
  const label = locale === 'ka' ? meta.ka : locale === 'ru' ? meta.ru : meta.en

  return (
    <div
      className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/40 flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}
    >
      <div className="flex items-center gap-2 min-w-0 max-w-[1280px] mx-auto w-full">
        <span
          className="material-symbols-outlined text-primary text-[20px]"
          aria-hidden="true"
        >
          {meta.icon}
        </span>
        <h1 className="font-[EB_Garamond] text-[18px] sm:text-[22px] leading-tight font-medium text-primary truncate">
          {label}
        </h1>
        <span className="ml-auto font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary/60">
          Kai Admin
        </span>
      </div>
    </div>
  )
}
