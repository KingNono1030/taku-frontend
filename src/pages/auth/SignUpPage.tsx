import { Link } from 'react-router-dom';

import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';

const SignUpPage = () => {
  return (
    <div className="mx-auto mb-[6.25rem] mt-[3.75rem] w-[560px]">
      <h1 className="mb-8 text-[2rem] font-semibold leading-[2.625rem]">
        회원가입
      </h1>
      <SignUpForm />
      <Button
        className="mb-6 mt-20 h-14 w-full bg-[#EAB308] py-4 font-semibold text-white hover:bg-[#EAB308]/90"
        type="submit"
        form="loginForm"
      >
        회원가입하기
      </Button>
      <h2 className="text-center text-base text-[#64748B]">
        이미 계정이 있으신가요?
        <Link to={'/auth/signup'}>
          <Button
            className="ml-2 p-0 text-sm text-[#0F172A] underline"
            variant="link"
          >
            로그인하기
          </Button>
        </Link>
      </h2>
    </div>
  );
};

export default SignUpPage;
