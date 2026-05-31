import { useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { api } from '../../../convex/_generated/api'
import { cn } from '@/lib/utils'

type AdminTab =
  | 'analytics'
  | 'rooms'
  | 'reservations'
  | 'gallery'
  | 'sponsors'
  | 'messages'
  | 'settings'

interface AdminBottomNavProps {
  activeTab: AdminTab
}

/**
 * Sole admin navigation. Five thumb-friendly destinations rendered as a
 * persistent bottom bar across every viewport:
 *
 *   Dashboard · Bookings · Rooms · Messages · Settings
 *
 * Gallery, Sponsors, Language toggle and Sign-out live inside the Settings
 * tab as sub-sections, so this bar is the only navigation surface in the app.
 */
export function AdminBottomNav({ activeTab }: AdminBottomNavProps) {
  const { locale } = useI18n()
  const navigate = useNavigate()
  const { sessionToken } = useAdminAuth()

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

  // Gallery and Sponsors are nested under Settings, so when the active tab is
  // one of them the Settings button stays highlighted.
  const settingsActiveTabs = new Set<AdminTab>([
    'settings',
    'gallery',
    'sponsors',
  ])

  const items: {
    tab: AdminTab
    icon: string
    label: string
    badge?: number
    matches: (current: AdminTab) => boolean
  }[] = [
    {
      tab: 'analytics',
      icon: 'dashboard',
      label: locale === 'ka' ? 'მთავარი' : 'Home',
      matches: (t) => t === 'analytics',
    },
    {
      tab: 'reservations',
      icon: 'event_available',
      label: locale === 'ka' ? 'ჯავშნები' : 'Bookings',
      badge: pendingReservations,
      matches: (t) => t === 'reservations',
    },
    {
      tab: 'rooms',
      icon: 'bed',
      label: locale === 'ka' ? 'ნომრები' : 'Rooms',
      matches: (t) => t === 'rooms',
    },
    {
      tab: 'messages',
      icon: 'mail',
      label: locale === 'ka' ? 'შეტყობ.' : 'Messages',
      badge: unreadCount,
      matches: (t) => t === 'messages',
    },
    {
      tab: 'settings',
      icon: 'settings',
      label: locale === 'ka' ? 'პარამეტრები' : 'Settings',
      matches: (t) => settingsActiveTabs.has(t),
    },
  ]

  const goto = (tab: AdminTab) => {
    void navigate({ to: '/admin', search: (prev) => ({ ...prev, tab }) })
  }

  return (
    <nav
      aria-label="Admin navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-container-low/95 backdrop-blur-md border-t border-outline-variant/40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 max-w-[640px] mx-auto">
        {items.map((item) => {
          const isActive = item.matches(activeTab)
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => goto(item.tab)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary',
              )}
            >
              <span className="relative">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={
                    isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                  }
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-error text-on-error text-[9px] font-bold rounded-full px-1 min-w-[14px] h-[14px] flex items-center justify-center leading-none">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
              <span className="font-[Hanken_Grotesk] text-[10px] font-semibold tracking-wide truncate max-w-full px-1">
                {item.label}
              </span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
