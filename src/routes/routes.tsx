import { Suspense, lazy } from 'react';

import { Outlet } from 'react-router-dom';

import LoadingScreen from '@/components/loading';
import DefaultLayout from '@/layout/DefaultLayout';

// Lazy imports for components
const MainPage = lazy(() => import('@/pages/MainPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const KakaoCallBack = lazy(() => import('@/pages/oauth/KakaoCallBack'));
const SignupPage = lazy(() => import('@/pages/auth/SignUpPage'));
const CommunityCategoryPage = lazy(
  () => import('@/pages/community/CommunityCategoryPage'),
);
const CommunityDetailPage = lazy(
  () => import('@/pages/community/CommunityDetailPage'),
);
const CommunityPage = lazy(() => import('@/pages/community/CommunityPage'));
const CreateCommunityPage = lazy(
  () => import('@/pages/community/CreateCommunityPage'),
);
const UpdateCommunityPage = lazy(
  () => import('@/pages/community/UpdateCommunityPage'),
);
const CreateMarketPage = lazy(() => import('@/pages/market/CreateMarketPage'));
const MarketDetailPage = lazy(() => import('@/pages/market/MarketDetailPage'));
const MarketPage = lazy(() => import('@/pages/market/MarketPage'));
const UpdateMarketPage = lazy(() => import('@/pages/market/UpdateMarketPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const CreateShortsPage = lazy(() => import('@/pages/shorts/CreateShortsPage'));
const ShortsPage = lazy(() => import('@/pages/shorts/ShortsPage'));

export const routes = [
  {
    element: (
      <DefaultLayout>
        <Suspense fallback={<LoadingScreen message="컨텐츠 불러오는 중" />}>
          <Outlet />
        </Suspense>
      </DefaultLayout>
    ),
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/auth/login', element: <LoginPage /> },
      { path: '/auth/signup', element: <SignupPage /> },
      { path: '/oauth/kakao', element: <KakaoCallBack /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/:category', element: <CommunityCategoryPage /> },
      { path: '/community/:category/:id', element: <CommunityDetailPage /> },
      { path: '/community/:category/add', element: <CreateCommunityPage /> },
      {
        path: '/community/:category/:id/edit',
        element: <UpdateCommunityPage />,
      },
      { path: '/market', element: <MarketPage /> },
      { path: '/market/add', element: <CreateMarketPage /> },
      { path: '/market/:id', element: <MarketDetailPage /> },
      { path: '/market/:id/edit', element: <UpdateMarketPage /> },
      { path: '/shorts', element: <ShortsPage /> },
      { path: '/shorts/add', element: <CreateShortsPage /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
];
