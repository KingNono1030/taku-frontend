import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { logout } from '@/services/auth';
import useUserStore from '@/store/userStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  return useMutation({
    mutationFn: async () => {
      return logout();
    },
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      console.log(data);
      clearUser();

      navigate('/');
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
    },
  });
};
