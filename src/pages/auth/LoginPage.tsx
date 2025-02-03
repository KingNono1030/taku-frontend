import { Link } from 'react-router-dom';

import GoogleIcon from '@/assets/ic-google.svg';
import KakaoIcon from '@/assets/ic-kakao.svg';
import { Button } from '@/components/ui/button';
import { GOOGLE_OAUTH_URI, KAKAO_OAUTH_URI } from '@/constants/api/oauth';

const LoginPage = () => {
  return (
    <div className="mx-auto mb-[6.25rem] mt-[3.75rem] w-[560px]">
      <h1 className="mb-8 text-[2rem] font-semibold leading-[2.625rem]">
        로그인
      </h1>
      <div className="my-16 flex flex-col gap-8">
        <Link to={KAKAO_OAUTH_URI}>
          <Button className="relative h-10 w-full bg-[#FEE500] py-4 font-semibold text-[#000000/85] hover:bg-[#FEE500]/90">
            <img
              className="absolute left-[11px] top-1/2 h-6 w-6 -translate-y-1/2"
              src={KakaoIcon}
              alt="카카오 로그인 버튼"
            />
            카카오 로그인
          </Button>
        </Link>
        <Link to={GOOGLE_OAUTH_URI}>
          <Button className="relative h-10 w-full border border-solid border-[#e5e7eb] bg-white py-4 font-semibold text-[#000000/85] hover:bg-white">
            <img
              className="absolute left-[11px] top-1/2 h-[18px] w-[18px] -translate-y-1/2"
              src={GoogleIcon}
              alt="구글 로그인 버튼"
            />
            Google 계정으로 로그인
          </Button>
        </Link>
        <Link
          to={
            '/oauth/callback?token=eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsIm5pY2tuYW1lIjoibG9vY28iLCJwcm92aWRlclR5cGUiOiJLQUtBTyIsInByb2ZpbGVJbWciOiJodHRwczovL2R1Y2t3aG8tdmlkZW8uY2U0MDBhY2YwYThlYzg3MjY1YzhmZGE2ZWM2OGY5NTkucjIuY2xvdWRmbGFyZXN0b3JhZ2UuY29tLzk3OWRlZmRiLTJjZWQtNGM1NS1iNzY3LTA1NjdkYTQ0NjRmZi5wbmciLCJzdGF0dXMiOiJBQ1RJVkUiLCJkb21lc3RpY0lkIjoiMzgzNTM0MTc3NiIsImdlbmRlciI6Ik1BTEUiLCJhZ2VSYW5nZSI6IjIwfjI5Iiwicm9sZSI6IlVTRVIiLCJlbWFpbCI6InNlczk4OTJAbmF2ZXIuY29tIiwicG9zdHMiOltdLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzM2MjQwMDM3LCJleHAiOjE3Mzg4MzIwMzd9.d-mA2t2m_SDi6kyKMb-UmM2gwhEZdJ-IA0RcqTz3uhE&user={"nickname":"nono","profileImg":"https://picsum.photos/200/300","gender":"male","ageRange":"20~19"}'
          }
        >
          <Button className="relative h-10 w-full border border-solid border-[#e5e7eb] bg-white py-4 font-semibold text-[#000000/85] hover:bg-white">
            테스트
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
