import { useParams } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import ChatLayout from '@/layout/ChatLayout';

import { ChatList } from './ChatList';

const EmptyStateMessage = () => {
  return (
    <div className="flex flex-1 flex-col bg-background p-6">
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">채팅</h2>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto rounded-2xl border border-border/40 bg-card/50 p-6">
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">👈 채팅방을 선택해주세요</p>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { roomId } = useParams();

  return (
    <ChatLayout>
      <ChatList />
      {roomId ? <Outlet /> : <EmptyStateMessage />}
    </ChatLayout>
  );
};

export default ChatPage;
