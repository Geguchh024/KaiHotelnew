import { Component, useEffect, useState, type ReactNode } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AnalyticsTab } from '@/components/admin/tabs/AnalyticsTab'
import { RoomsTab } from '@/components/admin/tabs/RoomsTab'
import { GalleryTab } from '@/components/admin/tabs/GalleryTab'
import { SponsorsTab } from '@/components/admin/tabs/SponsorsTab'
import { MessagesTab } from '@/components/admin/tabs/MessagesTab'
import { SettingsTab } from '@/components/admin/tabs/SettingsTab'

const adminSearchSchema = z.object({
  tab: z
    .enum(['analytics', 'rooms', 'gallery', 'sponsors', 'messages', 'settings'])
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
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="material-symbols-outlined text-[48px] text-error/60">error</span>
          <p className="font-[EB_Garamond] text-[24px] text-primary">Something went wrong</p>
          <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface-variant">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
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
  gallery: GalleryTab,
  sponsors: SponsorsTab,
  messages: MessagesTab,
  settings: SettingsTab,
}

function AdminLayoutComponent() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate()
  // Start as null (matches server render), populate client-side in useEffect
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

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

  // null = still checking (SSR + first client paint), false = redirecting
  if (!isAuthed) return null

  const TabComponent = TAB_COMPONENTS[tab]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={tab} />
      <main className="ml-64 flex-1 min-h-screen px-8 py-10 max-w-[1280px]">
        <AdminHeader />
        <AdminErrorBoundary>
          <TabComponent />
        </AdminErrorBoundary>
      </main>
    </div>
  )
}
