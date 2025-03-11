import { AxiosResponse } from 'axios';

import { ducku, duckuWithAuth } from '@/lib/axiosInstance';
import type {
  CheckNicknameSuccessResponse,
  EditUserSuccessResponse,
  FindUserDetailSuccessResponse,
  RegisterUserRequest,
  RegisterUserSuccessResponse,
} from '@/types/api/user.types';

export interface RegisterUserRequestWithJSON
  extends Omit<RegisterUserRequest, 'user'> {
  user: string;
}

export const getUser = async (
  userId: number,
): Promise<FindUserDetailSuccessResponse> => {
  const { data } = await duckuWithAuth.get(`/api/user/${userId}`);
  return data;
};

export const registerUser = async (
  formData: FormData,
  token: string,
): Promise<RegisterUserSuccessResponse> => {
  const { data } = await ducku.post('/api/user', formData, {
    headers: {
      'X-Registration-Token': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const editUser = async (
  formData: FormData,
  userId: number,
): Promise<AxiosResponse<EditUserSuccessResponse>> => {
  const { data } = await duckuWithAuth.patch(`/api/user/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const checkNickname = async (
  nickname: string,
): Promise<AxiosResponse<CheckNicknameSuccessResponse>> => {
  const { data } = await ducku.get(`/api/user/nickname/${nickname}`);
  return data;
};

export const deleteUser = async (
  userId: number,
): Promise<AxiosResponse<CheckNicknameSuccessResponse>> => {
  const { data } = await duckuWithAuth.delete(`/api/user/${userId}`);
  return data;
};
