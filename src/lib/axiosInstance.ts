import axios from 'axios';

import useUserStore from '@/store/userStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TEST_ACCESS_TOKEN = import.meta.env.VITE_GOOGLE_ACCESS_TOKEN;

const ducku = axios.create({
  baseURL: 'https://api-duckwho.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ducku;

//테스트용 axios 인스턴스
export const testAxios = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
  },
});

class TokenError extends Error {
  constructor() {
    super('인증 토큰이 없습니다.');
    this.name = 'TokenError';
  }
}

const getToken = () => useUserStore.getState().token;

const duckuWithAuth = axios.create({
  baseURL: 'https://api-duckwho.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
});

duckuWithAuth.interceptors.request.use((config) => {
  const token = getToken();
  if (!token) {
    throw new TokenError();
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 토큰 갱신이 필요한 경우를 대비한 response interceptor 추가
duckuWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 등의 처리
      useUserStore.getState().clearUser();
      // 로그인 페이지로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  },
);

export { ducku, duckuWithAuth };
