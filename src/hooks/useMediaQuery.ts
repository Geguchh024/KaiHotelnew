import { useEffect, useState } from 'react'

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * SSR-safe: defaults to `false` on the server and updates on the client.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    // Sync once in case it changed between SSR and hydration.
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Convenience: true while the viewport is below the Tailwind `sm` breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)')
}

/** Convenience: true at Tailwind `lg` (1024px) and above — the breakpoint
 *  that swaps the mobile bottom-nav out for a persistent desktop sidebar. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
