import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Doc } from '../../../convex/_generated/dataModel'

export type Message = Doc<"messages">

interface MessageRowProps {
  message: Message
  isSelected: boolean
  onSelect: (message: Message) => void
}

function formatDate(timestamp: number, locale: string): string {
  return new Date(timestamp).toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageRow({ message, isSelected, onSelect }: MessageRowProps) {
  const { locale } = useI18n()
  const { sessionToken } = useAdminAuth()
  const markReadMutation = useMutation(api.messages.markRead)

  const handleClick = async () => {
    onSelect(message)

    if (!message.isRead) {
      await markReadMutation({ sessionToken: sessionToken!, id: message._id })
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          void handleClick()
        }
      }}
      className={[
        'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border-b border-outline-variant/30 cursor-pointer transition-all duration-200',
        'hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/30',
        isSelected
          ? 'bg-primary-container/20 border-l-2 border-l-primary'
          : message.isRead
            ? 'bg-surface-container-lowest'
            : 'bg-secondary-container/10',
      ].join(' ')}
      aria-selected={isSelected}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Read/unread indicator */}
        <span
          className={[
            'material-symbols-outlined flex-shrink-0 text-[20px] sm:text-[22px]',
            message.isRead ? 'text-on-surface-variant/50' : 'text-primary',
          ].join(' ')}
          style={message.isRead ? { fontVariationSettings: "'FILL' 0" } : { fontVariationSettings: "'FILL' 1" }}
          aria-label={message.isRead
            ? (locale === 'ka' ? 'წაკითხული' : 'Read')
            : (locale === 'ka' ? 'წაუკითხავი' : 'Unread')}
        >
          mail
        </span>

        {/* Sender info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={[
                'font-[Hanken_Grotesk] text-[13px] sm:text-[14px] truncate',
                message.isRead ? 'font-normal text-on-surface' : 'font-semibold text-on-surface',
              ].join(' ')}
            >
              {message.senderName}
            </span>
            {!message.isRead && (
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            )}
          </div>
          <span className="font-[Hanken_Grotesk] text-[11px] sm:text-[12px] text-on-surface-variant truncate block">
            {message.email}
          </span>
        </div>
      </div>

      {/* Bottom row on mobile / inline on desktop */}
      <div className="flex items-center gap-2 sm:gap-3 pl-8 sm:pl-0">
        {/* Inquiry type */}
        <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary bg-secondary-container/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
          {message.inquiryType}
        </span>

        {/* Timestamp */}
        <span className="font-[Hanken_Grotesk] text-[10px] sm:text-[11px] text-on-surface-variant whitespace-nowrap ml-auto sm:ml-0">
          {formatDate(message.submittedAt, locale)}
        </span>
      </div>
    </div>
  )
}
