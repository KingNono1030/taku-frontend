/* eslint-disable no-unused-vars */
import { TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { MarketPriceSearchResponse } from '@/types/market-price-type/marketPrice.types';

interface PriceListProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  priceData: MarketPriceSearchResponse;
}

export const PriceList = ({
  selectedPeriod,
  setSelectedPeriod,
  priceData,
}: PriceListProps) => {
  const dataPoints = priceData.data?.priceGraph?.dataPoints;

  if (!dataPoints || dataPoints.length < 2) {
    return null;
  }

  const latestData = dataPoints[dataPoints.length - 1];
  const previousData = dataPoints[dataPoints.length - 2];

  // null 체크 추가
  const latestPrice = latestData.registeredPrice ?? 0;
  const previousPrice = previousData.registeredPrice ?? 0;
  const priceDiff = latestPrice - previousPrice;
  const priceChangePercent =
    previousPrice !== 0
      ? ((priceDiff / previousPrice) * 100).toFixed(2)
      : '0.00';

  return (
    <div>
      {/* 가격 정보 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{priceData.data?.keyword}</h2>
        {/* 가격 표시 */}
        <div className="flex space-x-16">
          <div className="flex items-end gap-2">
            <span className="text-[40px] font-bold text-blue-500">
              {latestPrice.toLocaleString()}
            </span>
            <span className="mb-1 text-[28px] text-blue-500">원</span>
            <div className="mb-2 flex items-center gap-1">
              {priceDiff >= 0 ? (
                <TrendingUp className="h-5 w-5 text-blue-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-blue-500" />
              )}
              <span className="text-blue-500">
                {Math.abs(priceDiff).toLocaleString()} 원
              </span>
              <span className="text-muted-foreground">
                ({priceChangePercent}%)
              </span>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[40px] font-bold text-red-500">
              {(latestData.soldPrice ?? 0).toLocaleString()}
            </span>
            <span className="mb-1 text-[28px] text-red-500">원</span>
            <div className="mb-2 flex items-center gap-1">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <span className="text-red-500">
                {Math.abs(
                  latestData.soldPrice ?? 0 - (previousData.soldPrice ?? 0),
                ).toLocaleString()}{' '}
                원
              </span>
              <span className="text-muted-foreground">
                (
                {(
                  (((latestData.soldPrice ?? 0) -
                    (previousData.soldPrice ?? 0)) /
                    (previousData.soldPrice ?? 1)) *
                  100
                ).toFixed(2)}
                %)
              </span>
            </div>
          </div>
        </div>

        {/* 기간 탭 */}
        <div className="flex h-[72px] gap-4">
          {['1일', '1주일'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
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
      </div>
    </div>
  );
};
