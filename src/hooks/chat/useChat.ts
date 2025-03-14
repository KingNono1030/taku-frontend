import { useNavigate } from 'react-router-dom';

import { useChatRooms, useCreateChatRoom } from '@/queries/chat';
import useUserStore from '@/store/userStore';
import type { ChatRoomInfo } from '@/types/chat-type/chat.types';

export const useChat = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const {
    data: chatRooms,
    isLoading: isChatRoomsLoading,
    refetch: refetchChatRooms,
  } = useChatRooms();
  const createChatRoomMutation = useCreateChatRoom();

  const findChatRoomByProductId = (
    productId: number,
  ): ChatRoomInfo | undefined => {
    return chatRooms?.data?.find(
      (room: ChatRoomInfo) => room.articleId === productId,
    );
  };

  const handleChat = async (productId: number) => {
    if (!user || !token) {
      console.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    // 현재 상품 ID와 일치하는 채팅방 찾기
    const existingChatRoom = findChatRoomByProductId(productId);

    if (existingChatRoom) {
      // 기존 채팅방이 있다면 해당 채팅방으로 이동
      console.log('기존 채팅방 이동');
      navigate(`/chat/${existingChatRoom.roomId}`);
    } else {
      try {
        // 새로운 채팅방 생성
        const response = await createChatRoomMutation.mutateAsync(productId);
        console.log('새로운 채팅방생성');

        if (response?.data) {
          const newChatRoom = response.data as unknown as ChatRoomInfo;
          // 생성된 채팅방 데이터로 바로 이동
          navigate(`/chat/${newChatRoom.roomId}`);
          console.log('새로운 채팅방 생성 응답', response.data);

          // 채팅방 목록 백그라운드에서 새로고침
          refetchChatRooms();
        } else {
          console.error('채팅방 생성 실패');
        }
      } catch (error) {
        console.error('채팅방 생성 중 오류 발생:', error);
      }
    }
  };

  return {
    chatRooms,
    isChatRoomsLoading,
    handleChat,
    isLoggedIn: !!user && !!token,
  };
};
