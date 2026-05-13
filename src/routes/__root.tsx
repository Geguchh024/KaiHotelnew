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
        title: 'Kai Hotel Bar | ბოტანიკური სიმშვიდე',
      },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
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
  return (
    <html lang="ka" className="scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-on-surface">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
