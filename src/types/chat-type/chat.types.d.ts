import type { components } from '../api/apiSchema.types';

export type ChatRoomRequest = components['schemas']['ChatRoomRequestDTO'];
export type ChatRoomResponse = {
  success: boolean;
  data: ChatRoomInfo;
  error: null | string;
};
export type ChatMessageResponse =
  components['schemas']['ChatMessageResponseDTO'];
export type CommonResponse<T> = {
  success: boolean;
  data: T;
  error: null | string;
};

// API 응답 타입들을 components에서 직접 가져오도록 수정
// export type CommonChatRoomResponse = {
//   success: boolean;
//   data: ChatRoom[];
//   error: null | string;
// };

// API 응답 타입
export interface ChatRoomInfo {
  /** Format: int64 */
  chatRoomId: number;
  wsRoomId: string;
  /** Format: int64 */
  articleId: number;
  /** Format: int64 */
  buyerId: number;
  /** Format: int64 */
  sellerId: number;
  /** Format: date-time */
  buyerNickname: string;
  sellerNickname: string;
  lastMessage: ChatMessageResponse;
  createdAt: string;
  updatedAt: string;
  articleImageUrl: string;
  unreadMessageCount: number;
  buyerProfileImageUrl: string;
  sellerProfileImageUrl: string;
}

// 채팅 메시지 타입
export interface ChatMessage {
  messageId: string;
  chatRoomId: number;
  wsRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  formattedTime: string;
  read: boolean;
}

// 메시지 전송 요청 타입
export interface SendMessageRequest {
  roomId: string;
  senderId: string;
  content: string;
  type: 'TEXT';
}

// 읽음 상태 업데이트 타입
export interface ReadStatusUpdate {
  roomId: string;
  messageId: string;
  readerId: string;
  readAt: string;
}

// 안읽은 채팅 응답 타입
export interface UnreadChatResponse {
  success: boolean;
  data: number;
  error: string | null;
}

// components에서 가져오는 타입은 다른 이름으로 변경
export type ChatRoomDTO = components['schemas']['ChatRoomResponseDTO'];

// 페이지네이션 응답 타입 추가
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 채팅방 목록 조회 응답 타입
export type ChatRoomListResponse = {
  success: boolean;
  data: PageableResponse<ChatRoomInfo>;
  error: null | string;
};
