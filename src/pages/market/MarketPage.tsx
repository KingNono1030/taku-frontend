import { Link, Outlet, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

const MarketPage = () => {
  const location = useLocation();

  const tabs = [
    { name: '상품 조회/검색', path: '/market' },
    { name: '시세', path: '/market/price' },
    { name: '인기 순위', path: '/market/ranking' },
  ];

  return (
    <div className="mt-10 flex gap-4">
      <aside className="w-[260px] shrink-0 bg-background">
        <div className="space-y-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">덕후장터</h1>

          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'rounded-lg px-4 py-2 text-base transition-colors',
                  location.pathname === tab.path
                    ? 'bg-primary font-medium text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {tab.name}
              </Link>
            ))}
          </div>

          <hr className="my-4" />
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* 오른쪽 사이드바가 필요한 경우 추가 */}
    </div>
  );
};

export default MarketPage;
