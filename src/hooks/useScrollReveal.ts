import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element when it scrolls into view, using a single shared
 * IntersectionObserver pattern (one observer per element). Returns a ref to
 * attach and a boolean for whether it has become visible.
 *
 * Performance notes:
 * - Observation stops (unobserve) once revealed, so there's no ongoing cost.
 * - Respects `prefers-reduced-motion`: such users are marked visible up-front
 *   so no transform/opacity animation runs.
 * - SSR-safe: defaults to hidden on the server and reveals on the client.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean },
) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Honor reduced-motion: reveal immediately, skip the observer entirely.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    // No IntersectionObserver (very old browsers / some SSR shims): show it.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const once = options?.once ?? true
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.01,
        // Reveal just before the element reaches the viewport.
        rootMargin: options?.rootMargin ?? '0px 0px 12% 0px',
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options?.threshold, options?.rootMargin, options?.once])

  return { ref, isVisible }
}
