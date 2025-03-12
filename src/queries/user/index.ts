import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';

import { deleteUser, editUser, getUser, registerUser } from '@/services/user';
import useUserStore from '@/store/userStore';

export const useRegisterUser = () => {
  const navigate = useNavigate();

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
      navigate('/login');
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

export const useEditUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => editUser(formData, userId),
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
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

export const useDeleteUser = (userId: number) => {
  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
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

export const useUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      return await getUser(userId);
    },
    staleTime: 300000,
    initialData: () => {
      return queryClient.getQueryData(['user', userId]);
    },
  });
};
