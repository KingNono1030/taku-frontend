export const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
export const KAKAO_REDIRECT_URL = import.meta.env.VITE_KAKAO_REDIRECT_URL;

export const KAKAO_OAUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&response_type=code`;
