import { useEffect, useState } from 'react';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { createChatRoom } from '@/services/chat';
import type { ChatMessage } from '@/types/chat-type/chat.types';

const BASE_URL = 'https://api-duckwho.xyz';

interface UseWebSocketProps {
  roomId: string | undefined;
  token: string | undefined;
  userId: number | undefined;
  onMessageReceived?: () => void;
}

interface ReadStatus {
  roomId: string;
  messageId: string;
  readerId: string;
  readAt: string;
}

interface ReceivedMessage {
  id: number | null;
  chatRoomId: number;
  articleId: number;
  senderId: number;
  content: string;
  sentAt: number[];
  read: boolean;
  status: string;
}

export const useWebSocket = ({
  roomId,
  token,
  userId,
  onMessageReceived,
}: UseWebSocketProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [readStatus, setReadStatus] = useState<Record<string, ReadStatus>>({});

  // 읽음 상태 업데이트 발송 함수
  const updateReadStatus = (messageId: string) => {
    if (!stompClient || !isConnected || !roomId || !userId) {
      console.error('읽음 상태 업데이트 실패:', {
        hasStompClient: !!stompClient,
        isConnected,
        hasRoomId: !!roomId,
        hasUserId: !!userId,
      });

      // 연결이 끊어진 경우 재연결 시도
      if (!isConnected && roomId && token && userId) {
        console.log('WebSocket 연결이 끊어졌습니다. 재연결을 시도합니다...');
        connect();
      }
      return;
    }

    const readStatusData = {
      roomId,
      messageId,
      readerId: String(userId),
      readAt: new Date().toISOString(),
    };

    console.log('읽음 상태 업데이트 발송:', readStatusData);

    stompClient.publish({
      destination: '/pub/chat/read',
      body: JSON.stringify(readStatusData),
      headers: {
        'content-type': 'application/json',
        roomId: roomId,
      },
    });
  };

  const connect = async () => {
    if (!roomId || !token || !userId) {
      console.log('WebSocket 연결 실패: 필수 파라미터 누락', {
        roomId,
        hasToken: !!token,
        userId,
      });
      return;
    }

    let client: Client | null = null;

    client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log(`[Room ${roomId}] STOMP Debug:`, str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log(`[Room ${roomId}] Connected to WebSocket`);
        setIsConnected(true);

        // 채팅방 메시지 구독
        const messageSubscription = client?.subscribe(
          `/sub/chat/room/${roomId}`,
          async (message) => {
            console.log('새 메시지 수신:', message);
            const receivedMessage: ReceivedMessage = JSON.parse(message.body);
            console.log('파싱된 메시지:', receivedMessage);

            // 새로운 메시지가 다른 채팅방에서 온 경우
            if (receivedMessage.chatRoomId !== Number(roomId)) {
              try {
                // 해당 articleId로 새로운 채팅방 생성
                await createChatRoom(receivedMessage.articleId);
                console.log('새로운 채팅방 생성 완료');
              } catch (error) {
                console.error('새로운 채팅방 생성 실패:', error);
              }
            }

            onMessageReceived && onMessageReceived();

            if (receivedMessage.senderId !== userId) {
              console.log('다른 사용자의 메시지 수신, 읽음 상태 업데이트 시도');
              updateReadStatus(String(receivedMessage.chatRoomId));
            }
          },
        );
        console.log('메시지 구독 완료:', messageSubscription);

        // 읽음 상태 구독
        const readStatusSubscription = client?.subscribe(
          `/sub/chat/room/${roomId}/read`,
          (status) => {
            console.log('읽음 상태 구독 시작');
            console.log('구독 경로:', `/sub/chat/room/${roomId}/read`);
            console.log('수신된 메시지:', status);

            try {
              const readInfo = JSON.parse(status.body);
              console.log('파싱된 읽음 상태 데이터:', readInfo);

              if (!readInfo.readerId || !readInfo.messageId) {
                console.error('잘못된 읽음 상태 데이터:', readInfo);
                return;
              }

              setReadStatus((prev) => {
                const newStatus = {
                  ...prev,
                  [readInfo.messageId]: {
                    roomId: readInfo.roomId,
                    messageId: readInfo.messageId,
                    readerId: readInfo.readerId,
                    readAt: readInfo.readAt,
                  },
                };
                console.log('읽음 상태 업데이트 완료:', newStatus);
                return newStatus;
              });
            } catch (error) {
              console.error('읽음 상태 파싱 에러:', error);
            }
          },
          {
            id: `read-status-${roomId}`,
            ack: 'auto',
          },
        );
        console.log('읽음 상태 구독 완료:', readStatusSubscription);
      },
      onStompError: (frame) => {
        console.error(`[Room ${roomId}] STOMP Error:`, frame);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error(`[Room ${roomId}] WebSocket Error:`, event);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log(`[Room ${roomId}] Disconnected from WebSocket`);
        setIsConnected(false);
      },
    });

    try {
      console.log('WebSocket 클라이언트 활성화 시도...');
      await client.activate();
      setStompClient(client);
      console.log('WebSocket 클라이언트 활성화 완료');
    } catch (error) {
      console.error(`[Room ${roomId}] Failed to connect:`, error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      console.log(`[Room ${roomId}] Cleaning up connection`);
      if (stompClient?.connected) {
        stompClient.deactivate();
      }
      setStompClient(null);
      setIsConnected(false);
      setMessages([]);
      setReadStatus({});
    };
  }, [roomId, token, userId]);

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!content.trim() || !userId || !stompClient || !isConnected) {
      console.error('Cannot send message: ', {
        hasContent: !!content.trim(),
        hasUserId: !!userId,
        hasStompClient: !!stompClient,
        isConnected,
      });
      return false;
    }

    try {
      stompClient.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify({
          roomId,
          senderId: userId,
          content,
        }),
      });

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  return {
    messages,
    setMessages,
    isConnected,
    sendMessage,
    readStatus,
  };
};
