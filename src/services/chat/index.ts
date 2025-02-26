import { duckuWithAuth } from '@/lib/axiosInstance';
import type { CommonChatRoomResponse } from '@/types/chat-type/chat.types';

// 채팅방 목록 조회
export const getChatRooms = async () => {
  const response =
    await duckuWithAuth.get<CommonChatRoomResponse>('/api/chat/rooms');
  return response.data;
};

// 채팅방 생성
export const createChatRoom = async (articleId: number) => {
  const response = await duckuWithAuth.post<CommonChatRoomResponse>(
    '/api/chat/rooms',
    null,
    {
      params: {
        articleId: articleId,
      },
    },
  );
  return response.data;
};
