import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRoomUnreadCount } from '@/queries/chat';
import type { ChatRoom } from '@/types/chat-type/chat.types';

interface ChatRoomItemProps {
  room: ChatRoom;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatRoomItem = ({
  room,
  isActive,
  onSelect,
}: ChatRoomItemProps) => {
  const { data: unreadCount } = useRoomUnreadCount(room.roomId);
  const unreadMessageCount = unreadCount?.data ?? 0;

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl p-4 transition-all ${
        isActive ? 'bg-primary/10' : 'hover:bg-primary/5'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={room.sellerProfileImage}
            alt={room.sellerNickname}
          />
          <AvatarFallback className="bg-primary/20 ring-1 ring-primary/50">
            {room.sellerNickname?.slice(0, 2) || 'UN'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">
              {room.sellerNickname}
            </h3>
            <span className="text-xs text-muted-foreground">
              {room.lastMessageTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {room.lastMessage}
            </p>
            {unreadMessageCount > 0 && (
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
