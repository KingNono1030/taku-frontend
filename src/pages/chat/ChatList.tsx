import { useNavigate, useParams } from 'react-router-dom';

import { useChat } from '@/hooks/useChat';
import type { ChatRoom } from '@/types/chat-type/chat.types';

import { ChatRoomItem } from './ChatRoomItem';

export const ChatList = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { chatRooms, isChatRoomsLoading } = useChat();

  if (isChatRoomsLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex min-w-[320px] flex-col border-r border-border/50 bg-card p-6">
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">메시지</h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {chatRooms?.data?.map((room: ChatRoom) => (
          <ChatRoomItem
            key={room.id}
            room={room}
            isActive={room.roomId === roomId}
            onSelect={() => navigate(`${room.roomId}`)}
          />
        ))}
      </div>
    </div>
  );
};
