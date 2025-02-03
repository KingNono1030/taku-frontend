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
  requestBody: RegisterUserRequestWithJSON,
  code: string,
): Promise<RegisterUserSuccessResponse> => {
  const { data } = await ducku.post('/api/user', requestBody, {
    headers: {
      'X-Registration-Token': `Bearer ${code}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
