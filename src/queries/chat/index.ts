import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { createChatRoom, getChatRooms, getUnreadTotal } from '@/services/chat';
import useUserStore from '@/store/userStore';

// 채팅방 목록 조회 query hook
export const useChatRooms = () => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  return useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
    enabled: !!user && !!token, // 로그인된 상태에서만 실행
  });
};

// 채팅방 생성 mutation hook
export const useCreateChatRoom = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (productId: number) => createChatRoom(productId),
    onSuccess: (response) => {
      if (response.success && response.data) {
        navigate(`chat`);
      }
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          navigate(`chat`);
        } else if (error.response?.status === 401) {
          console.error('로그인이 필요합니다');
          navigate('/login');
        }
      }
      console.error('채팅방 생성 중 오류 발생:', error);
    },
  });
};

// 안읽은 메시지 수 query hook
export const useUnreadTotal = () => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  return useQuery({
    queryKey: ['unreadTotal'],
    queryFn: getUnreadTotal,
    enabled: !!user && !!token,
  });
};
