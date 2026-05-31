import { memo } from 'react'
import type { ElementType, ReactNode } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface RevealProps {
  children: ReactNode
  /** Element tag to render. Defaults to a div. */
  as?: ElementType
  /** Stagger step (1–5) applied as an animation-delay. */
  delay?: 1 | 2 | 3 | 4 | 5
  className?: string
  /** Re-trigger every time it enters the viewport (default reveals once). */
  repeat?: boolean
}

/**
 * Drop-in wrapper that fades + slides its children into view on scroll.
 * Built on a single IntersectionObserver per instance and fully respects
 * `prefers-reduced-motion` (handled inside useScrollReveal + CSS).
 */
export const Reveal = memo(function Reveal({
  children,
  as,
  delay,
  className = '',
  repeat = false,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ once: !repeat })

  return (
    <Tag
      ref={ref}
      data-delay={delay}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
})
