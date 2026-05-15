import { useNavigate } from '@tanstack/react-router'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { cn } from '@/lib/utils'
import { useQuery, useMutation } from 'convex/react'
import { ConvexError } from 'convex/values'
import { api } from '../../../convex/_generated/api'
import { Component, type ReactNode } from 'react'

type AdminTab = 'analytics' | 'rooms' | 'reservations' | 'gallery' | 'sponsors' | 'messages' | 'settings'

interface AdminSidebarProps {
  activeTab: AdminTab
  isOpen: boolean
  onClose: () => void
}

const navItems: { icon: string; tab: AdminTab; labelKey: string }[] = [
  { icon: 'analytics', tab: 'analytics', labelKey: 'admin.sidebar.analytics' },
  { icon: 'bed', tab: 'rooms', labelKey: 'admin.sidebar.rooms' },
  { icon: 'event_available', tab: 'reservations', labelKey: 'admin.sidebar.reservations' },
  { icon: 'photo_library', tab: 'gallery', labelKey: 'admin.sidebar.gallery' },
  { icon: 'handshake', tab: 'sponsors', labelKey: 'admin.sidebar.sponsors' },
  { icon: 'mail', tab: 'messages', labelKey: 'admin.sidebar.messages' },
  { icon: 'settings', tab: 'settings', labelKey: 'admin.sidebar.settings' },
]

/**
 * Error boundary that catches Convex "Unauthorized" errors from stale session
 * tokens and triggers a logout + redirect to /admin/login.
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
      (error instanceof ConvexError && String(error.data).includes('Unauthorized')) ||
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

export function AdminSidebar({ activeTab, isOpen, onClose }: AdminSidebarProps) {
  const { logout } = useAdminAuth()

  const handleUnauthorized = () => {
    localStorage.removeItem('adminSessionToken')
    logout()
  }

  return (
    <AuthErrorBoundary onUnauthorized={handleUnauthorized}>
      <AdminSidebarInner activeTab={activeTab} isOpen={isOpen} onClose={onClose} />
    </AuthErrorBoundary>
  )
}

function AdminSidebarInner({ activeTab, isOpen, onClose }: AdminSidebarProps) {
  const { locale, setLocale, t } = useI18n()
  const { logout, sessionToken } = useAdminAuth()
  const navigate = useNavigate()
  const logoutMutation = useMutation(api.auth.logout)

  const unreadCount = useQuery(api.messages.unreadCount) ?? 0
  const pendingReservations = useQuery(
    api.reservations.pendingCount,
    sessionToken ? { sessionToken } : 'skip'
  ) ?? 0

  const handleTabClick = (tab: AdminTab) => {
    void navigate({ to: '/admin', search: (prev) => ({ ...prev, tab }) })
    onClose()
  }

  const handleLogout = async () => {
    if (sessionToken) {
      await logoutMutation({ sessionToken })
    }
    logout()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/50 flex flex-col p-6 z-50 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="font-[EB_Garamond] text-[24px] leading-[1.4] font-medium text-primary mb-1">
              {t('admin.sidebar.title')}
            </h1>
            <p className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.15em] text-secondary/70">
              Botanical Suite
            </p>
          </div>
          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === 'ka' ? 'en' : 'ka')}
            className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors border border-outline-variant px-2 py-1 rounded-sm mt-1"
            aria-label="Toggle language"
          >
            {locale === 'ka' ? 'EN' : 'ქარ'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 text-left',
                activeTab === item.tab
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high',
              )}
              aria-current={activeTab === item.tab ? 'page' : undefined}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-[Hanken_Grotesk] text-[13px] font-semibold flex-1">
                {t(item.labelKey)}
              </span>
              {/* Unread badge for messages */}
              {item.tab === 'messages' && unreadCount > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              {/* Pending badge for reservations */}
              {item.tab === 'reservations' && pendingReservations > 0 && (
                <span className="bg-error text-on-error text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {pendingReservations}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-outline-variant/30">
          <button
            onClick={() => void handleLogout()}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-all duration-200 rounded-full text-left w-full"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-[Hanken_Grotesk] text-[13px] font-semibold">
              {t('admin.sidebar.logout')}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
