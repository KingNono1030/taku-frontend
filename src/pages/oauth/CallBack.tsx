import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import useUserStore from '@/store/userStore';

const OauthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') as string;
  const encodedUser = searchParams.get('user') as string;
  const user = JSON.parse(encodedUser);
  const { setUser, setToken } = useUserStore();

  useEffect(() => {
    if (token && user) {
      setToken(token);
      setUser(user);
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
