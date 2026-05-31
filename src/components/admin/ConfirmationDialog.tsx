import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Tone = 'destructive' | 'primary'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
  /**
   * Visual tone of the confirm button:
   *  - 'destructive' (red) for irreversible actions like cancel/delete
   *  - 'primary' (brand color) for positive actions like confirm/check-in/check-out
   * Defaults to 'destructive' to preserve existing behavior.
   */
  tone?: Tone
  /** Optional Material Symbols icon shown in the header. */
  icon?: string
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'destructive',
  icon,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const confirmClasses =
    tone === 'destructive'
      ? 'bg-error text-on-error'
      : 'bg-primary text-on-primary'

  const iconBg =
    tone === 'destructive'
      ? 'bg-error/10 text-error'
      : 'bg-primary/10 text-primary'

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-sm w-full max-w-md mx-2 sm:mx-4 shadow-xl">
        <div className="p-6 sm:p-7">
          {icon && (
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${iconBg}`}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </div>
          )}
          <h2
            id="confirm-dialog-title"
            className="font-[EB_Garamond] text-[22px] sm:text-[24px] leading-[1.3] text-primary mb-2"
          >
            {title}
          </h2>
          <p
            id="confirm-dialog-description"
            className="font-[Hanken_Grotesk] text-[13px] sm:text-[14px] text-on-surface-variant leading-relaxed"
          >
            {description}
          </p>
        </div>
        <div
          className="flex items-center justify-end gap-2.5 px-4 sm:px-7 pb-5 pt-2 border-t border-outline-variant/15"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)' }}
        >
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold hover:opacity-90 transition-opacity ${confirmClasses}`}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
