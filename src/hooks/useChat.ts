import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useChatRooms } from '@/queries/chat';
import { createChatRoom } from '@/services/chat';
import useUserStore from '@/store/userStore';

export const useChat = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const { data: chatRooms, isLoading: isChatRoomsLoading } = useChatRooms();

  const handleChat = async (productId: number, sellerId: number) => {
    if (!user || !token) {
      console.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    if (sellerId) {
      try {
        const response = await createChatRoom(productId);
        if (response.success && response.data) {
          navigate('chat');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            navigate(`chat`);
          } else if (error.response?.status === 401) {
            console.error('로그인이 필요합니다');
            navigate('/login');
          }
        }
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
