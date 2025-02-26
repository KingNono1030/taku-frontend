import { useQuery } from '@tanstack/react-query';

import { getChatRooms } from '@/services/chat';
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
