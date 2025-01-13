import { useState } from 'react';

import { TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const MarketPricePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1일' | '1주일'>('1일');

  return (
    <div className="flex flex-col space-y-8">
      {/* 상품 정보 */}
      <div className="space-y-20">
        {/* 가격 정보 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">원피스 루피 피규어</h2>
          {/* 가격 표시 */}
          <div className="flex space-x-16">
            <div className="flex items-end gap-2">
              <span className="text-[40px] font-bold text-blue-500">
                100,000
              </span>
              <span className="mb-1 text-[28px] text-blue-500">원</span>
              <div className="mb-2 flex items-center gap-1">
                <TrendingDown className="h-5 w-5 text-blue-500" />
                <span className="text-blue-500">3,000 원</span>
                <span className="text-muted-foreground">(-n.nn%)</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-[40px] font-bold text-red-500">
                100,000
              </span>
              <span className="mb-1 text-[28px] text-red-500">원</span>
              <div className="mb-2 flex items-center gap-1">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <span className="text-red-500">3,000 원</span>
                <span className="text-muted-foreground">(-n.nn%)</span>
              </div>
            </div>
          </div>

          {/* 기간 탭 */}
          <div className="flex h-[72px] gap-4">
            {['1일', '1주일'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as '1일' | '1주일')}
                className={cn(
                  'relative pb-2 text-base transition-colors',
                  selectedPeriod === period
                    ? 'border-b font-medium text-foreground'
                    : 'text-muted-foreground',
                  selectedPeriod === period &&
                    'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-foreground',
                )}
              >
                {period}
              </button>
            ))}
          </div>
          {/* 차트 영역 */}
          <div className="aspect-video w-full rounded-lg bg-purple-500" />
        </div>

        {/* 최근 거래된 상품 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            최근 거래된 상품 (일주일 내)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {['평균 거래가', '최고 거래가', '최저 거래가'].map(
              (label, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-muted p-4 text-center"
                >
                  <div className="text-sm text-muted-foreground">{label}</div>
                  <div className="mt-1 font-semibold">00,000 원</div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* 연관 상품 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">연관 상품</h3>
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square rounded-lg bg-purple-500" />
                <div className="line-clamp-2 text-sm">상품명</div>
                <div className="text-sm font-semibold">00,000 원</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPricePage;
