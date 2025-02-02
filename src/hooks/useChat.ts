import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { testAxios } from '@/lib/axiosInstance';

export const useChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 채팅방 목록 조회
  const getChatRooms = async (userId: number) => {
    try {
      const response = await testAxios.get('/api/chat/rooms', {
        params: {
          userId: userId,
        },
      });
      return response;
    } catch (error) {
      console.error('채팅방 조회 실패:', error);
      throw error;
    }
  };

  const handleChat = async (productId: number, sellerId: number) => {
    if (sellerId) {
      try {
        // 채팅방 생성
        await testAxios.post('/api/chat/rooms', {
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

  return { handleChat, getChatRooms };
};
