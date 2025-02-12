import { duckuWithAuth } from '@/lib/axiosInstance';
import type { LogoutSuccessResponse } from '@/types/api/auth.types';

export const logout = async (): Promise<LogoutSuccessResponse> => {
  const { data } = await duckuWithAuth.post('/api/auth/logout');
  return data;
};
