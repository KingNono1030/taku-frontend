import type { components } from '../api/apiSchema.types';

export type ChatRoomRequest = components['schemas']['ChatRoomRequestDTO'];
export type ChatRoomResponse = components['schemas']['ChatRoomResponseDTO'];
export type CommonChatRoomResponse = {
  success: boolean;
  data: ChatRoom[];
  error: null | string;
};

// API 응답 타입
export interface ChatRoom {
  /** Format: int64 */
  id: number;
  roomId: string;
  /** Format: int64 */
  articleId: number;
  /** Format: int64 */
  buyerId: number;
  /** Format: int64 */
  sellerId: number;
  /** Format: int64 */
  lastMessageId?: number;
  /** Format: int64 */
  unreadCount?: number;
  /** Format: date-time */
  createdAt: number[];
}

// 채팅 메시지 타입
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}
