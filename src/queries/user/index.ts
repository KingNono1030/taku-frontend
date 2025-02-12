import { useMutation } from '@tanstack/react-query';

// import { useNavigate } from 'react-router-dom';

import { registerUser } from '@/services/user';

export const useRegisterUser = () => {
  // const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      formData,
      token,
    }: {
      formData: FormData;
      token: string;
    }) => {
      return registerUser(formData, token);
    },
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      console.log(data);

      // navigate(`/market/${productId}`);
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
