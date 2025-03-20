import { useEffect, useState } from 'react';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import type { ChatMessage } from '@/types/chat-type/chat.types';

const BASE_URL = 'https://api-duckwho.xyz';

interface UseWebSocketProps {
  roomId: string | undefined;
  token: string | undefined;
  userId: number | undefined;
  onMessageReceived?: () => void;
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
  const [readStatus, setReadStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!roomId || !token || !userId) return;

    let client: Client | null = null;

    const connect = async () => {
      client = new Client({
        webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        // debug: (str) => {
        //   console.log(`[Room ${roomId}] STOMP Debug:`, str);
        // },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log(`[Room ${roomId}] Connected to WebSocket`);
          setIsConnected(true);

          // 채팅방 메시지 구독
          client?.subscribe(`/sub/chat/room/${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);

            onMessageReceived && onMessageReceived();

            if (receivedMessage.senderId !== userId) {
              updateReadStatus();
            }
          });

          // 읽음 상태 구독
          client?.subscribe(`/sub/chat/room/${roomId}/read`, (status) => {
            const readInfo = JSON.parse(status.body);
            setReadStatus((prev) => ({
              ...prev,
              [readInfo.readerId]: readInfo.readAt,
            }));
          });
        },
        onDisconnect: () => {
          console.log(`[Room ${roomId}] Disconnected from WebSocket`);
          setIsConnected(false);
        },
      });

      try {
        await client.activate();
        setStompClient(client);
      } catch (error) {
        console.error(`[Room ${roomId}] Failed to connect:`, error);
      }
    };

    connect();

    return () => {
      console.log(`[Room ${roomId}] Cleaning up connection`);
      if (client?.connected) {
        client.deactivate();
      }
      setStompClient(null);
      setIsConnected(false);
      setMessages([]);
      setReadStatus({});
    };
  }, [roomId, token, userId]);

  // 메시지 읽음 상태 업데이트
  const updateReadStatus = () => {
    if (!stompClient || !isConnected || !roomId || !userId) return;

    stompClient.publish({
      destination: '/pub/chat/read',
      body: JSON.stringify({
        roomId,
        readerId: userId,
        readAt: new Date().toISOString(),
      }),
    });
  };

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
