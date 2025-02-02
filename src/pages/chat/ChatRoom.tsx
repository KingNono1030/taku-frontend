import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { Message } from '@/types/chat-type/chat.types';

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // 임시 데이터
  useEffect(() => {
    setMessages([
      {
        id: '1',
        senderId: '1',
        content: '안녕하세요!',
        timestamp: '14:30',
        isMine: false,
      },
      {
        id: '2',
        senderId: '2',
        content: '네 안녕하세요~',
        timestamp: '14:31',
        isMine: true,
      },
    ]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: '2',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMine: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-1 flex-col bg-background p-6">
      {/* 채팅방 헤더 */}
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">
          채팅방 {roomId}
        </h2>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-6 overflow-y-auto rounded-2xl border border-border/40 bg-card/50 p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end space-x-3 ${
              message.isMine ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            }`}
          >
            {!message.isMine && (
              <div className="h-9 w-9 rounded-full bg-primary/20 ring-1 ring-primary/50" />
            )}
            <div
              className={`max-w-[70%] space-y-1 rounded-2xl px-4 py-3 ${
                message.isMine
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white text-foreground shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div
                className={`text-[10px] ${
                  message.isMine
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 영역 */}
      <form onSubmit={handleSendMessage} className="mt-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 rounded-full border border-border/50 bg-white px-6 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
