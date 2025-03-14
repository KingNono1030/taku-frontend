/* eslint-disable no-unused-vars */
import { TrendingDown, TrendingUp } from 'lucide-react';

import { MarketPriceSearchResponse } from '@/types/market-price-type/marketPrice.types';

interface PriceListProps {
  startDate: Date;
  endDate: Date;
  onPeriodChange: (start: Date, end: Date) => void;
  priceData: MarketPriceSearchResponse;
}

interface PriceDisplayProps {
  label: string;
  price: number;
  priceDiff: number;
  priceChangePercent: string;
  colorScheme: 'blue' | 'red';
}

const PriceDisplay = ({
  price,
  priceDiff,
  priceChangePercent,
  colorScheme,
}: PriceDisplayProps) => {
  const colors = {
    blue: 'text-blue-500',
    red: 'text-red-500',
  };

  const textColor = colors[colorScheme];

  return (
    <div className="flex items-end gap-2">
      <span className={`text-[40px] font-bold ${textColor}`}>
        {price.toLocaleString()}
      </span>
      <span className={`mb-1 text-[28px] ${textColor}`}>원</span>
      <div className="mb-2 flex items-center gap-1">
        {priceDiff <= 0 ? (
          <TrendingDown className={`h-5 w-5 ${textColor}`} />
        ) : (
          <TrendingUp className={`h-5 w-5 ${textColor}`} />
        )}
        <span className={textColor}>
          {Math.abs(priceDiff).toLocaleString()} 원
        </span>
        <span className="text-muted-foreground">({priceChangePercent}%)</span>
      </div>
    </div>
  );
};

export const PriceList = ({
  startDate,
  endDate,
  priceData,
}: PriceListProps) => {
  const dataPoints = priceData.data?.priceGraph?.dataPoints;
  const averageSoldPrice = priceData.data?.averageSoldPrice ?? 0;
  console.log('판매가', priceData);

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

  // 최신 판매가 가져오기
  const latestData = filteredDataPoints[filteredDataPoints.length - 1];
  const latestSoldPrice = latestData.registeredPrice ?? 0;

  // 평균 판매가와 최신 판매가 비교
  const priceDiff = latestSoldPrice - averageSoldPrice;
  const priceChangePercent =
    averageSoldPrice !== 0
      ? ((priceDiff / averageSoldPrice) * 100).toFixed(2)
      : '0.00';

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{priceData.data?.keyword}</h2>
        <div className="flex space-x-16">
          <PriceDisplay
            label="현재 판매가"
            price={latestSoldPrice}
            priceDiff={priceDiff}
            priceChangePercent={priceChangePercent}
            colorScheme={priceDiff >= 0 ? 'red' : 'blue'}
          />
          <div className="flex flex-col">
            <span className="text-lg text-gray-600">평균 판매가</span>
            <span className="text-2xl font-semibold">
              {averageSoldPrice.toLocaleString()} 원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
