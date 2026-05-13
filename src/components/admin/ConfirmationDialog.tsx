import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: ConfirmationDialogProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative bg-surface-container-lowest border border-outline-variant/30 p-8 w-full max-w-md mx-4 shadow-xl">
        <h2
          id="dialog-title"
          className="font-[EB_Garamond] text-[24px] leading-[1.3] text-primary mb-3"
        >
          {title}
        </h2>
        <p
          id="dialog-description"
          className="font-[Hanken_Grotesk] text-[14px] text-on-surface-variant mb-8 leading-relaxed"
        >
          {description}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full font-[Hanken_Grotesk] text-[13px] font-semibold bg-error text-on-error hover:opacity-90 transition-opacity"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

