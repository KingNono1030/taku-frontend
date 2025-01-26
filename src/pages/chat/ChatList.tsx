import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}
export const ChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();
  const { roomId } = useParams();

  // 임시 데이터
  useEffect(() => {
    setChatRooms([
      {
        id: '1',
        name: '사용자1',
        lastMessage: '안녕하세요',
        timestamp: '14:30',
        unreadCount: 2,
      },
      {
        id: '2',
        name: '사용자2',
        lastMessage: '네 알겠습니다',
        timestamp: '15:45',
        unreadCount: 0,
      },
    ]);
  }, []);
  return (
    <div className="flex min-w-[320px] flex-col border-r border-border/50 bg-card p-6">
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">메시지</h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => navigate(`/chat/${room.id}`)}
            className={`cursor-pointer rounded-2xl p-4 transition-all ${
              room.id === roomId ? 'bg-primary/10' : 'hover:bg-primary/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 ring-1 ring-primary/50" />
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{room.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {room.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {room.lastMessage}
                  </p>
                  {room.unreadCount > 0 && (
                    <div className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                      {room.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
