/* eslint-disable no-unused-vars */
import { TrendingDown, TrendingUp } from 'lucide-react';

import { MarketPriceSearchResponse } from '@/types/market-price-type/marketPrice.types';

interface PriceListProps {
  startDate: Date;
  endDate: Date;
  onPeriodChange: (start: Date, end: Date) => void;
  priceData: MarketPriceSearchResponse;
}

export const PriceList = ({
  startDate,
  endDate,
  priceData,
}: PriceListProps) => {
  const dataPoints = priceData.data?.priceGraph?.dataPoints;

  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-white p-4">
        <p className="text-muted-foreground">가격 데이터가 없습니다.</p>
      </div>
    );
  }

  // 선택된 기간 내의 데이터만 필터링
  const filteredDataPoints = dataPoints.filter((point) => {
    if (!point.date) return false;
    const pointDate = new Date(point.date);
    return pointDate >= startDate && pointDate <= endDate;
  });

  const latestData = filteredDataPoints[filteredDataPoints.length - 1];
  const previousData =
    filteredDataPoints.length > 1
      ? filteredDataPoints[filteredDataPoints.length - 2]
      : latestData;

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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{priceData.data?.keyword}</h2>
        <div className="flex space-x-16">
          <div className="flex items-end gap-2">
            <span className="text-[40px] font-bold text-blue-500">
              {latestPrice.toLocaleString()}
            </span>
            <span className="mb-1 text-[28px] text-blue-500">원</span>
            <div className="mb-2 flex items-center gap-1">
              {priceDiff >= 0 ? (
                <TrendingDown className="h-5 w-5 text-blue-500" />
              ) : (
                <TrendingUp className="h-5 w-5 text-blue-500" />
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
      </div>
    </div>
  );
};
