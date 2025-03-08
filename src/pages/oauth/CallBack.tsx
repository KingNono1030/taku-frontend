import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import useUserStore from '@/store/userStore';
import { UserDetail, UserDetailFromLogin } from '@/types/api/user.types';

const OauthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') as string;
  const base64String = searchParams.get('user') as string;
  const decodedString = decodeURIComponent(escape(atob(base64String)));
  const user = JSON.parse(decodedString) as UserDetailFromLogin;
  const { setUser, setToken } = useUserStore();

  useEffect(() => {
    if (token && user) {
      const newUser = {
        id: user.user_id,
        nickname: user.nickname,
        profileImg: user.profile_image,
      } as UserDetail;
      setToken(token);
      setUser(newUser);
      navigate('/');
    }
  }, []);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
};

export default OauthCallBack;
