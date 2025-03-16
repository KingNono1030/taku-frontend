import type { components } from '../api/apiSchema.types';

export type ChatRoomRequest = components['schemas']['ChatRoomRequestDTO'];
export type ChatRoomResponse = components['schemas']['ChatRoomResponseDTO'];
export type CommonChatRoomResponse = {
  success: boolean;
  data: ChatRoom[];
  error: null | string;
};

// API 응답 타입
export interface ChatRoomInfo {
  /** Format: int64 */
  id: number;
  roomId: string;
  /** Format: int64 */
  articleId: number;
  /** Format: int64 */
  buyerId: number;
  /** Format: int64 */
  sellerId: number;
  /** Format: date-time */
  createdAt: number[];
  buyerNickname: string;
  buyerProfileImage: string;
  sellerNickname: string;
  sellerProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSenderId: number;
}

// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: number;
  senderNickname: string;
  content: string;
  type: 'TEXT';
  createdAt: string;
  readCount: number;
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  roomId: string;
  senderId: number;
  content: string;
  type: 'TEXT';
}

// 읽음 상태 업데이트 타입
export interface ReadStatusUpdate {
  roomId: string;
  messageId: string;
  readerId: number;
  readAt: string;
}

// 안읽은 채팅 응답 타입
export interface UnreadChatResponse {
  success: boolean;
  data: number;
  error: ExceptionDto | null;
}
