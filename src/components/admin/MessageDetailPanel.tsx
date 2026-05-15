import { useI18n } from '@/lib/i18n'
import type { Message } from '@/components/admin/MessageRow'

interface MessageDetailPanelProps {
  message: Message
  onClose: () => void
}

function formatDate(timestamp: number, locale: string): string {
  return new Date(timestamp).toLocaleDateString(locale === 'ka' ? 'ka-GE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageDetailPanel({ message, onClose }: MessageDetailPanelProps) {
  const { locale } = useI18n()

  return (
    <div className="border border-outline-variant/40 bg-surface-container-lowest rounded-sm mt-1 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/30 bg-surface-container-low">
        <h4 className="font-[EB_Garamond] text-[18px] sm:text-[20px] text-primary">
          {locale === 'ka' ? 'შეტყობინების დეტალები' : 'Message Details'}
        </h4>
        <button
          onClick={onClose}
          aria-label={locale === 'ka' ? 'დახურვა' : 'Close'}
          className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full p-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Panel body */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Sender name + email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {locale === 'ka' ? 'გამგზავნი' : 'Sender'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[15px] text-on-surface font-medium">
              {message.senderName}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {locale === 'ka' ? 'ელ-ფოსტა' : 'Email'}
            </span>
            <a
              href={`mailto:${message.email}`}
              className="font-[Hanken_Grotesk] text-[15px] text-secondary hover:underline"
            >
              {message.email}
            </a>
          </div>
        </div>

        {/* Inquiry type + submitted at */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {locale === 'ka' ? 'მოთხოვნის ტიპი' : 'Inquiry Type'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[13px] font-semibold uppercase tracking-[0.08em] text-secondary bg-secondary-container/30 px-2.5 py-1 rounded-full inline-block">
              {message.inquiryType}
            </span>
          </div>
          <div>
            <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-1">
              {locale === 'ka' ? 'გაგზავნის თარიღი' : 'Submitted At'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[14px] text-on-surface">
              {formatDate(message.submittedAt, locale)}
            </span>
          </div>
        </div>

        {/* Message body */}
        <div>
          <span className="font-[Hanken_Grotesk] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant block mb-2">
            {locale === 'ka' ? 'შეტყობინება' : 'Message'}
          </span>
          <div className="bg-surface-container-high rounded-sm p-4 border border-outline-variant/20">
            <p className="font-[Hanken_Grotesk] text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap">
              {message.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

