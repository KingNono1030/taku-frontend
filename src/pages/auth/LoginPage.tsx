import { Link } from 'react-router-dom';

import { SignInForm } from '@/components/auth/SignInForm';
import { Button } from '@/components/ui/button';
import { KAKAO_OAUTH_URI } from '@/constants/api/oauth';

const LoginPage = () => {
  return (
    <div className="mx-auto mb-[6.25rem] mt-[3.75rem] w-[560px]">
      <h1 className="mb-8 text-[2rem] font-semibold leading-[2.625rem]">
        로그인
      </h1>
      <SignInForm />
      <Button
        className="mb-6 mt-20 h-14 w-full bg-[#EAB308] py-4 font-semibold text-white hover:bg-[#EAB308]/90"
        type="submit"
        form="loginForm"
      >
        로그인하기
      </Button>
      <h2 className="text-center text-base text-[#64748B]">
        아직 계정이 없으신가요?
        <Link to={'/auth/signup'}>
          <Button
            className="ml-2 p-0 text-sm text-[#0F172A] underline"
            variant="link"
          >
            회원가입하기
          </Button>
        </Link>
      </h2>
      <Link to={KAKAO_OAUTH_URI}>
        <Button className="mb-6 mt-20 h-14 w-full bg-[#FEE500] py-4 font-semibold text-[#000000/85] hover:bg-[#FEE500]/90">
          카카오 로그인
        </Button>
      </Link>
    </div>
  );
};

export default LoginPage;
