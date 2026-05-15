import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { RoomCard } from '@/components/admin/RoomCard'
import { RoomFormDialog } from '@/components/admin/RoomFormDialog'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Doc } from '../../../../convex/_generated/dataModel'

type Room = Doc<"rooms">

export function RoomsTab() {
  const { locale, t } = useI18n()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const rooms = useQuery(api.rooms.list) ?? []
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h3 className="font-[EB_Garamond] text-[24px] sm:text-[28px] text-primary">
          {t('admin.rooms.title')}
        </h3>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary text-on-primary px-5 sm:px-6 py-2.5 rounded-full font-[Hanken_Grotesk] text-[12px] sm:text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t('admin.rooms.addRoom')}
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant font-[Hanken_Grotesk]">
          <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">bed</span>
          <p>{t('admin.rooms.noRooms')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={() => setEditingRoom(room)}
            />
          ))}
        </div>
      )}

      <RoomFormDialog
        isOpen={isAddDialogOpen || editingRoom !== null}
        room={editingRoom}
        onClose={() => {
          setIsAddDialogOpen(false)
          setEditingRoom(null)
        }}
      />
    </div>
  )
}



