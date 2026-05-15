import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { MessageRow } from '@/components/admin/MessageRow'
import { MessageDetailPanel } from '@/components/admin/MessageDetailPanel'
import type { Message } from '@/components/admin/MessageRow'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export function MessagesTab() {
  const { locale, t } = useI18n()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const messages = useQuery(api.messages.list) ?? []

  const handleSelectMessage = (message: Message) => {
    // Toggle off if already selected
    if (selectedMessage?._id === message._id) {
      setSelectedMessage(null)
    } else {
      setSelectedMessage(message)
    }
  }

  const handleCloseDetail = () => {
    setSelectedMessage(null)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h3 className="font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary">
          {t('admin.messages.title')}
        </h3>
        {messages.length > 0 && (
          <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant">
            {messages.filter((m) => !m.isRead).length > 0 && (
              <span className="bg-error text-on-error text-[11px] font-semibold px-2 py-0.5 rounded-full mr-2">
                {messages.filter((m) => !m.isRead).length}
              </span>
            )}
            {locale === 'ka'
              ? `სულ ${messages.length} შეტყობინება`
              : `${messages.length} total`}
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
          <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
            mail
          </span>
          <p>{t('admin.messages.noMessages')}</p>
        </div>
      ) : (
        <div className="border border-outline-variant/30 rounded-sm overflow-hidden">
          {messages.map((message) => (
            <div key={message._id}>
              <MessageRow
                message={message}
                isSelected={selectedMessage?._id === message._id}
                onSelect={handleSelectMessage}
              />
              {selectedMessage?._id === message._id && (
                <MessageDetailPanel
                  message={selectedMessage}
                  onClose={handleCloseDetail}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


