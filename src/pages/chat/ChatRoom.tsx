import { useEffect, useRef, useState } from 'react';

import { User } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/hooks/chat/useChat';
import { useWebSocket } from '@/hooks/chat/useWebSocket';
import { duckuWithAuth } from '@/lib/axiosInstance';
import { convertDateArrayToDateString } from '@/lib/utils';
import useUserStore from '@/store/userStore';
import { ChatRoomInfo } from '@/types/chat-type/chat.types';

const ChatRoom = () => {
  const { roomId } = useParams();

  const chatRoomEnd = useRef<HTMLDivElement>(null);

  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [newMessage, setNewMessage] = useState('');
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfo | null>(null);
  const { refetchChatRooms } = useChat();

  const { messages, setMessages, isConnected, sendMessage, readStatus } =
    useWebSocket({
      roomId: roomId ? roomId : undefined,
      token: token ? token : undefined,
      userId: user?.id ? user.id : undefined,
      onMessageReceived: () => {
        loadMessages();
      },
    });

  const scrollToBottom = () => {
    chatRoomEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 전체 메시지 읽음 상태 업데이트
  const updateReadStatus = async () => {
    try {
      await duckuWithAuth.post(
        `/api/chat/rooms/mark-as-read`,
        {
          wsRoomId: roomId,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (error) {
      console.error('Failed to update read status:', error);
    }
  };

  // 이전 메시지 로드 함수
  const loadMessages = async () => {
    try {
      const response = await duckuWithAuth.get(
        `/api/chat/rooms/${roomId}/messages`,
      );
      if (response.data?.data) {
        // 서버에서 받은 메시지 배열을 역순으로 정렬 (오래된 메시지가 먼저 오도록)
        const sortedMessages = response.data.data.messages.reverse();

        console.log('sortedMessages:', sortedMessages);

        setMessages(sortedMessages);
        updateReadStatus().then(() => {
          refetchChatRooms();
        });
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (error) {
      console.error('이전 메세지 로드 실패:', error);
    }
  };

  // 채팅방 정보 로드
  useEffect(() => {
    const loadRoomInfo = async () => {
      try {
        const response = await duckuWithAuth.get(`/api/chat/rooms/${roomId}`);
        if (response.data?.data) {
          setRoomInfo(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load room info:', error);
      }
    };

    if (roomId) {
      loadRoomInfo();
    }
  }, [roomId]);

  // 이전 메시지 로드
  useEffect(() => {
    if (roomId) {
      loadMessages();
    }
  }, [roomId, setMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (await sendMessage(newMessage)) {
      loadMessages().then(() => {
        setNewMessage('');
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background p-6">
      {/* 채팅방 헤더 */}
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {`채팅방 ${roomId}`}
        </h2>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-6 overflow-y-auto rounded-2xl border border-border/40 bg-card/50 p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end space-x-3 ${
              message.senderId === user?.id
                ? 'flex-row-reverse space-x-reverse'
                : 'flex-row'
            }`}
          >
            {message.senderId !== user?.id && (
              <Avatar>
                <AvatarImage
                  src={roomInfo?.sellerProfileImage}
                  alt={roomInfo?.sellerNickname}
                />
                <AvatarFallback className="bg-primary/20 ring-1 ring-primary/50">
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col items-end">
              <div
                className={`w-fit max-w-[400px] rounded-2xl px-4 py-3 ${
                  message.senderId === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white text-foreground shadow-sm'
                }`}
              >
                <p className="break-words text-sm">{message.content}</p>
                <div
                  className={`mt-1 text-[10px] ${
                    message.senderId === user?.id
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {convertDateArrayToDateString(message?.sentAt)}
                </div>
              </div>
              {message.senderId === user?.id && (
                <span className="mt-1 text-[10px] text-muted-foreground">
                  {Object.keys(readStatus).length > 1 ? '읽음' : '안읽음'}
                </span>
              )}{' '}
            </div>
          </div>
        ))}
        <div ref={chatRoomEnd} />
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
            disabled={!isConnected}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
