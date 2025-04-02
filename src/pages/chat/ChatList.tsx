import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useChat } from '@/hooks/chat/useChat';
import type { ChatRoomInfo } from '@/types/chat-type/chat.types';

import { ChatRoomItem } from './ChatRoomItem';

export const ChatList = () => {
  const navigate = useNavigate();
  const { wsRoomId } = useParams();
  const { chatRooms, isChatRoomsLoading } = useChat();

  // URL에서 productId 파라미터 가져오기 (채팅하기 버튼을 통해 들어온 경우)
  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('productId');

  useEffect(() => {
    if (productId && chatRooms?.data?.content) {
      const targetRoom = chatRooms.data.content.find(
        (room: ChatRoomInfo) => room.articleId === Number(productId),
      );

      if (targetRoom) {
        // 해당 상품의 채팅방이 있다면 자동으로 이동
        navigate(`/chat/${targetRoom.wsRoomId}`);
      }
    }
  }, [productId, chatRooms, navigate]);

  const handleRoomSelect = (selectedRoomId: string) => {
    // 현재 채팅방과 다른 방을 선택한 경우에만 이동
    if (selectedRoomId !== wsRoomId) {
      navigate(`/chat/${selectedRoomId}`);
    }
  };

  if (isChatRoomsLoading) {
    return <div>로딩 중...</div>;
  }

  // API 응답 구조에 맞게 수정
  const chatRoomsList = chatRooms?.data?.content || [];

  return (
    <div className="flex min-w-[320px] flex-col border-r border-border/50 bg-card p-6">
      <div className="mb-6 border-b border-border/50 pb-4">
        <h2 className="text-xl font-semibold text-foreground">메시지</h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {chatRoomsList.map((room: ChatRoomInfo) => (
          <ChatRoomItem
            key={room.chatRoomId}
            room={room}
            isActive={room.wsRoomId === wsRoomId}
            onSelect={() => handleRoomSelect(room.wsRoomId)}
          />
        ))}
      </div>
    </div>
  );
};
