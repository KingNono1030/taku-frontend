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
  label: '판매가' | '구매가';
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
  // 색상 매핑 객체 추가
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

  // 가격 변동 계산
  // 현재는 PriceList는 선택된 기간 내에서 가장 최근 데이터와 그 직전 데이터를 비교하여 가격 변동 추이
  // TODO: 추후 변동 예정

  // 판매가 관련 계산
  const latestSellingPrice = latestData.registeredPrice ?? 0;
  const previousSellingPrice = previousData.registeredPrice ?? 0;
  const sellingPriceDiff = latestSellingPrice - previousSellingPrice;
  const sellingPriceChangePercent =
    previousSellingPrice !== 0
      ? ((sellingPriceDiff / previousSellingPrice) * 100).toFixed(2)
      : '0.00';

  // 구매가 관련 계산
  const latestBuyingPrice = latestData.soldPrice ?? 0;
  const previousBuyingPrice = previousData.soldPrice ?? 0;
  const buyingPriceDiff = latestBuyingPrice - previousBuyingPrice;
  const buyingPriceChangePercent =
    previousBuyingPrice !== 0
      ? ((buyingPriceDiff / previousBuyingPrice) * 100).toFixed(2)
      : '0.00';

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{priceData.data?.keyword}</h2>
        <div className="flex space-x-16">
          <PriceDisplay
            label="판매가"
            price={latestSellingPrice}
            priceDiff={sellingPriceDiff}
            priceChangePercent={sellingPriceChangePercent}
            colorScheme="blue"
          />
          <PriceDisplay
            label="구매가"
            price={latestBuyingPrice}
            priceDiff={buyingPriceDiff}
            priceChangePercent={buyingPriceChangePercent}
            colorScheme="red"
          />
        </div>
      </div>
    </div>
  );
};
