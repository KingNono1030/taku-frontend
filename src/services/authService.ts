import ducku from '@/lib/axiosInstance';

export const signIn = async (data: { email: string; password: string }) => {
  const response = await ducku.post('', data);
  return response;
};
export const signUp = async (data: {
  nickname: string;
  phoneNumber: string;
  authCode: string;
}) => {
  const response = await ducku.post('', data);
  return response;
};

export const kakaoLogin = async (data: {
  code: string;
  redirectURL: string;
}) => {
  const response = await ducku.post('', data);
  return response;
};
