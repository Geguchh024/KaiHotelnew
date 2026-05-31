import { Component, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { cn } from '@/lib/utils'
import { api } from '../../../convex/_generated/api'

type AdminTab =
  | 'analytics'
  | 'rooms'
  | 'reservations'
  | 'gallery'
  | 'sponsors'
  | 'messages'
  | 'settings'

interface AdminSidebarProps {
  activeTab: AdminTab
}

/**
 * Desktop-only navigation sidebar. Mirrors the bottom-nav destinations
 * (Dashboard · Bookings · Rooms · Messages · Settings) one-for-one so the
 * IA stays consistent across breakpoints. Gallery, Sponsors, language and
 * sign-out continue to live inside the Settings hub.
 */
const navItems: { icon: string; tab: AdminTab; labelKey: string }[] = [
  { icon: 'dashboard', tab: 'analytics', labelKey: 'admin.sidebar.analytics' },
  {
    icon: 'event_available',
    tab: 'reservations',
    labelKey: 'admin.sidebar.reservations',
  },
  { icon: 'bed', tab: 'rooms', labelKey: 'admin.sidebar.rooms' },
  { icon: 'mail', tab: 'messages', labelKey: 'admin.sidebar.messages' },
  { icon: 'settings', tab: 'settings', labelKey: 'admin.sidebar.settings' },
]

// When Gallery or Sponsors are open they live inside Settings — keep the
// Settings nav item highlighted.
const SETTINGS_GROUP = new Set<AdminTab>(['settings', 'gallery', 'sponsors'])

/**
 * Catches the Convex "Unauthorized" error from a stale token and triggers a
 * client-side logout so the layout can redirect to /admin/login cleanly.
 */
class AuthErrorBoundary extends Component<
  { children: ReactNode; onUnauthorized: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onUnauthorized: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
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
    if (this.state.hasError) return null
    return this.props.children
  }
}

export function AdminSidebar({ activeTab }: AdminSidebarProps) {
  const { logout } = useAdminAuth()

  const handleUnauthorized = () => {
    localStorage.removeItem('adminSessionToken')
    logout()
  }

  return (
    <AuthErrorBoundary onUnauthorized={handleUnauthorized}>
      <AdminSidebarInner activeTab={activeTab} />
    </AuthErrorBoundary>
  )
}

function AdminSidebarInner({ activeTab }: AdminSidebarProps) {
  const { t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const navigate = useNavigate()

  const unreadCount =
    useQuery(
      api.messages.unreadCount,
      sessionToken ? { sessionToken } : 'skip',
    ) ?? 0
  const pendingReservations =
    useQuery(
      api.reservations.pendingCount,
      sessionToken ? { sessionToken } : 'skip',
    ) ?? 0

  const handleTabClick = (tab: AdminTab) => {
    void navigate({ to: '/admin', search: (prev) => ({ ...prev, tab }) })
  }

  return (
    <aside
      className="hidden lg:flex h-screen w-72 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant/40 flex-col px-5 py-6 xl:px-6 xl:py-7 z-40"
      aria-label="Admin sidebar"
    >
      {/* Header */}
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <h1 className="font-[EB_Garamond] text-[27px] leading-[1.25] font-medium text-primary mb-1">
          {t('admin.sidebar.title')}
        </h1>
        <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70">
          Botanical Suite
        </p>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 flex flex-col gap-1 overflow-y-auto"
        aria-label="Admin navigation"
      >
        {navItems.map((item) => {
          const isActive =
            item.tab === 'settings'
              ? SETTINGS_GROUP.has(activeTab)
              : activeTab === item.tab
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-3 rounded-md border transition-all duration-200 text-left',
                isActive
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'text-on-surface-variant border-transparent hover:bg-surface-container-low hover:border-outline-variant/40',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="font-[Hanken_Grotesk] text-[13px] font-semibold flex-1">
                {t(item.labelKey)}
              </span>
              {item.tab === 'messages' && unreadCount > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              {item.tab === 'reservations' && pendingReservations > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {pendingReservations}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer hint — language + sign-out are inside Settings now,
          so the sidebar stays focused on navigation only. */}
      <div className="mt-auto pt-6 border-t border-outline-variant/30">
        <p className="font-[Hanken_Grotesk] text-[10px] text-on-surface-variant/70 leading-relaxed">
          {t('admin.sidebar.title')} ·{' '}
          <span className="text-on-surface-variant">v1</span>
        </p>
      </div>
    </aside>
  )
}
