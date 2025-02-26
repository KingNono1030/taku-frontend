import { useNavigate } from 'react-router-dom';

import { useChatRooms, useCreateChatRoom } from '@/queries/chat';
import useUserStore from '@/store/userStore';

export const useChat = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const { data: chatRooms, isLoading: isChatRoomsLoading } = useChatRooms();
  const createChatRoomMutation = useCreateChatRoom();
  console.log('token', token);

  const handleChat = async (productId: number, sellerId: number) => {
    if (!user || !token) {
      console.error('로그인이 필요합니다');
      navigate('/login');
      return;
    }

    if (sellerId) {
      await createChatRoomMutation.mutateAsync(productId);
    }
  };

  return {
    chatRooms,
    isChatRoomsLoading,
    handleChat,
    isLoggedIn: !!user && !!token,
  };
};
