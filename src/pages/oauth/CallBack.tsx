import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import useUserStore from '@/store/userStore';

const OauthCallBack = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') as string;
  const base64String = searchParams.get('user') as string;
  const decodedString = decodeURIComponent(escape(atob(base64String)));
  const user = JSON.parse(decodedString);
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
