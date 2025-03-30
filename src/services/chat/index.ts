import { duckuWithAuth } from '@/lib/axiosInstance';
import type {
  ChatRoomListResponse,
  ChatRoomResponse,
  UnreadChatResponse,
} from '@/types/chat-type/chat.types';

// 채팅방 목록 조회
export const getChatRooms = async () => {
  const response =
    await duckuWithAuth.get<ChatRoomListResponse>('/api/chat/rooms');
  return response.data;
};

// 채팅방 생성
export const createChatRoom = async (articleId: number) => {
  const response = await duckuWithAuth.post<ChatRoomResponse>(
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

// 안읽은 전체 메세지 개수
export const getUnreadTotal = async () => {
  const response = await duckuWithAuth.get<UnreadChatResponse>(
    '/api/chat/rooms/unread/total',
  );
  return response.data;
};

// 채팅방 별 안읽은 메세지 수
export const getRoomUnreadCount = async (roomId: string) => {
  const response = await duckuWithAuth.get<UnreadChatResponse>(
    `/api/chat/rooms/${roomId}/unread`,
  );
  return response.data;
};

// 특정 채팅방 조회
export const getChatRoom = async (roomId: string) => {
  const response = await duckuWithAuth.get<ChatRoomResponse>(
    `/api/chat/rooms/${roomId}`,
  );
  return response.data;
};
