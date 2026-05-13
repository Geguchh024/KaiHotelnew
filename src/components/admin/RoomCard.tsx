import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

interface Room {
  _id: Id<"rooms">
  nameKa: string
  nameEn: string
  pricePerNight: number
  capacity: number
  imageUrl: string
}

interface RoomCardProps {
  room: Room
  onEdit: () => void
}

export function RoomCard({ room, onEdit }: RoomCardProps) {
  const { locale, t } = useI18n()
  const { sessionToken } = useAdminAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const removeRoom = useMutation(api.rooms.remove)

  const handleDelete = async () => {
    await removeRoom({ sessionToken: sessionToken!, id: room._id })
    setIsDeleteDialogOpen(false)
  }

  const roomName = locale === 'ka' ? room.nameKa : room.nameEn

  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden group hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="aspect-video bg-surface-container-high overflow-hidden">
          {room.imageUrl ? (
            <img
              src={room.imageUrl}
              alt={roomName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">bed</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h4 className="font-[EB_Garamond] text-[20px] text-primary mb-2">{roomName}</h4>
          <div className="flex items-center gap-4 mb-4">
            <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">payments</span>
              ${room.pricePerNight}/{locale === 'ka' ? 'ღამე' : 'night'}
            </span>
            <span className="font-[Hanken_Grotesk] text-[13px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">group</span>
              {room.capacity} {locale === 'ka' ? 'სტუმარი' : 'guests'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex-1 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high px-4 py-2 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              {t('admin.common.edit')}
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 border border-error/30 text-error hover:bg-error/10 px-4 py-2 rounded-full font-[Hanken_Grotesk] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {t('admin.common.delete')}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={t('admin.rooms.deleteTitle')}
        description={
          locale === 'ka'
            ? `დარწმუნებული ხართ, რომ გსურთ "${roomName}" წაშლა? ეს მოქმედება შეუქცევადია.`
            : `Are you sure you want to delete "${roomName}"? This action cannot be undone.`
        }
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
      />
    </>
  )
}



