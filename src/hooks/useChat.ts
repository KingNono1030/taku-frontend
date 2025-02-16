import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { duckuWithAuth } from '@/lib/axiosInstance';
import useUserStore from '@/store/userStore';
import type { CommonChatRoomResponse } from '@/types/chat-type/chat.types';

export const useChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  if (!user) {
    return {
      chatRooms: null,
      isChatRoomsLoading: false,
      handleChat: () => {
        console.error('User not logged in');
      },
    };
  }

  const { data: chatRooms, isLoading: isChatRoomsLoading } = useQuery({
    queryKey: ['chatRooms', 10],
    queryFn: async () => {
      const response = await duckuWithAuth.get<CommonChatRoomResponse>(
        '/api/chat/rooms',
        {
          params: {
            userId: 10,
          },
        },
      );
      return response.data;
    },
  });

  const handleChat = async (productId: number, sellerId: number) => {
    if (sellerId) {
      try {
        await duckuWithAuth.post('/api/chat/rooms', {
          articleId: productId,
          buyerId: 10,
          sellerId: sellerId,
        });
        navigate(`chat/${id}`);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 409) {
          navigate(`chat/${id}`);
          return;
        }
        console.error('채팅방 생성 실패:', error);
      }
    }
  };

  return { chatRooms, isChatRoomsLoading, handleChat };
};
