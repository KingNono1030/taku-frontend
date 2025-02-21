import { useNavigate, useParams } from 'react-router-dom';

import { useChat } from '@/hooks/useChat';
import type { ChatRoom } from '@/types/chat-type/chat.types';

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
          <div
            key={room.id}
            onClick={() => navigate(`${room.roomId}`)}
            className={`cursor-pointer rounded-2xl p-4 transition-all ${
              room.roomId === roomId ? 'bg-primary/10' : 'hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 ring-1 ring-primary/50" />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    채팅방 {room.id}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {room.createdAt[0]}/{room.createdAt[1]}/{room.createdAt[2]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    상품 ID: {room.articleId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
