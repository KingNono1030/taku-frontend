import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  createChatRoom,
  getChatRoom,
  getChatRooms,
  getRoomUnreadCount,
  getUnreadTotal,
} from '@/services/chat';
import useUserStore from '@/store/userStore';

// 채팅방 목록 조회 query hook
export const useChatRooms = () => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: getChatRooms,
    enabled: !!user && !!token, // 로그인된 상태에서만 실행
  });

  return {
    data,
    isLoading,
    refetch,
  };
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

// 채팅방 별 안읽은 메세지 수 query hook
export const useRoomUnreadCount = (roomId: string) => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  return useQuery({
    queryKey: ['roomUnread', roomId],
    queryFn: () => getRoomUnreadCount(roomId),
    enabled: !!user && !!token && !!roomId,
  });
};

// 특정 채팅방 조회 query hook
export const useChatRoom = (roomId: string) => {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  return useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => getChatRoom(roomId),
    enabled: !!user && !!token && !!roomId,
  });
};
