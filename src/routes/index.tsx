import { lazy } from 'react';

import { useRoutes } from 'react-router-dom';

import { routes } from './routes';

const FallbackPage = lazy(() => import('@/pages/FallbackPage'));

export default function Router() {
  return useRoutes([...routes, { path: '*', element: <FallbackPage /> }]);
}
