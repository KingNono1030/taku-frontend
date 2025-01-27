import { useSearchParams } from 'react-router-dom';

import { SignUpForm } from '@/components/auth/SignUpForm';
import { OAuthProvider } from '@/types/api/user.types';

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') as string;
  const provider = searchParams.get('provider') as OAuthProvider;
  console.log('code : ', code, 'provider : ', provider);
  return (
    <div className="mx-auto mb-[6.25rem] mt-[3.75rem] w-[560px]">
      <h1 className="mb-8 text-[2rem] font-semibold leading-[2.625rem]">
        회원가입
      </h1>
      <SignUpForm code={code} provider={provider} />
    </div>
  );
};

export default SignUpPage;
