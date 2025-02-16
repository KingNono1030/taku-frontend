import { ducku } from '@/lib/axiosInstance';
import type {
  RegisterUserRequest,
  RegisterUserSuccessResponse,
} from '@/types/api/user.types';

export interface RegisterUserRequestWithJSON
  extends Omit<RegisterUserRequest, 'user'> {
  user: string;
}

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
