import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { ReservationRow } from '@/components/admin/ReservationRow'
import { ReservationDetailPanel } from '@/components/admin/ReservationDetailPanel'
import { ReservationFilters } from '@/components/admin/ReservationFilters'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { filterReservations } from '../../../utils/filterReservations'
import type { ReservationFilterCriteria } from '../../../utils/filterReservations'
import type { Reservation } from '@/components/admin/ReservationRow'
import type { Transition } from '../../../../convex/availability'
import type { Id } from '../../../../convex/_generated/dataModel'

export function ReservationsTab() {
  const { t, locale } = useI18n()
  const { sessionToken } = useAdminAuth()

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [criteria, setCriteria] = useState<ReservationFilterCriteria>({
    status: 'all',
    roomId: null,
    checkInFrom: null,
    checkInTo: null,
    search: '',
  })
  const [cancelTarget, setCancelTarget] = useState<Id<"reservations"> | null>(null)

  const result = useQuery(
    api.reservations.listPaginated,
    sessionToken ? { sessionToken, paginationOpts: { numItems: 100, cursor: null } } : 'skip'
  )

  const rooms = useQuery(api.rooms.list) ?? []
  const transitionMutation = useMutation(api.reservations.transitionStatus)

  const reservations = (result?.page ?? []) as Reservation[]

  // Build room name lookup
  const roomNameMap: Record<string, string> = {}
  for (const room of rooms) {
    roomNameMap[room._id] = locale === 'ka' ? room.nameKa : room.nameEn
  }

  // Apply client-side filters
  const filtered = filterReservations(reservations, criteria)

  const handleSelectReservation = (reservation: Reservation) => {
    if (selectedReservation?._id === reservation._id) {
      setSelectedReservation(null)
    } else {
      setSelectedReservation(reservation)
    }
  }

  const handleCloseDetail = () => {
    setSelectedReservation(null)
  }

  const handleTransition = async (id: Id<"reservations">, transition: Transition) => {
    if (!sessionToken) return
    if (transition === 'cancel') {
      setCancelTarget(id)
      return
    }
    await transitionMutation({ sessionToken, id, transition })
  }

  const handleConfirmCancel = async () => {
    if (!sessionToken || !cancelTarget) return
    await transitionMutation({ sessionToken, id: cancelTarget, transition: 'cancel' })
    setCancelTarget(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-[EB_Garamond] text-[28px] text-primary">
          {t('admin.reservations.title')}
        </h3>
        {filtered.length > 0 && (
          <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant">
            {locale === 'ka'
              ? `სულ ${filtered.length} რეზერვაცია`
              : `${filtered.length} total`}
          </span>
        )}
      </div>

      {/* Filters */}
      <ReservationFilters
        criteria={criteria}
        onChange={setCriteria}
        rooms={rooms}
      />

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
          <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
            event_available
          </span>
          <p>{t('admin.reservations.noReservations')}</p>
        </div>
      ) : (
        <div className="border border-outline-variant/30 rounded-sm overflow-hidden">
          {filtered.map((reservation) => (
            <div key={reservation._id}>
              <ReservationRow
                reservation={reservation}
                roomName={roomNameMap[reservation.roomId] ?? '—'}
                isSelected={selectedReservation?._id === reservation._id}
                onSelect={handleSelectReservation}
                onTransition={(id, tr) => void handleTransition(id, tr)}
              />
              {selectedReservation?._id === reservation._id && (
                <ReservationDetailPanel
                  reservation={selectedReservation}
                  roomName={roomNameMap[reservation.roomId] ?? '—'}
                  onClose={handleCloseDetail}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancel confirmation dialog (from row action buttons) */}
      <ConfirmationDialog
        isOpen={cancelTarget !== null}
        title={t('admin.reservations.confirmCancelTitle')}
        description={t('admin.reservations.confirmCancelDescription')}
        onConfirm={() => void handleConfirmCancel()}
        onCancel={() => setCancelTarget(null)}
        confirmLabel={t('admin.reservations.action.cancel')}
        cancelLabel={t('admin.common.cancel')}
      />
    </div>
  )
}
