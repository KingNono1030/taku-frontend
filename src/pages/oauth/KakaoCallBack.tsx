import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { KAKAO_REDIRECT_URL } from '@/constants/api/oauth';
import { kakaoLogin } from '@/services/auth';

const KakaoCallBack = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  console.log(code);
  useEffect(() => {
    if (code) {
      const response = kakaoLogin({ code, redirectURL: KAKAO_REDIRECT_URL });
      console.log(response);
    }
  }, [code]);

  return (
    <div>
      {`카카오 로그인 code: ${code}`}
      <LoadingSpinner />
    </div>
  );
};

export default KakaoCallBack;
