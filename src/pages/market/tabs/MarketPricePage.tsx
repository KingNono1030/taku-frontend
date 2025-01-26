import { useState } from 'react';

import { Chart } from '@/components/market-price/Chart';
import { PriceList } from '@/components/market-price/PriceList';
import { RecentlyTradedProduct } from '@/components/market-price/RecentlyTradedProduct';
import { RelatedProduct } from '@/components/market-price/RelatedProduct';
import {
  MarketPriceSearchResponse,
  Period,
} from '@/types/market-price-type/marketPrice.types';

const MarketPricePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1일');

  // Mock 데이터
  const dailyMockData: MarketPriceSearchResponse = {
    success: true,
    data: {
      keyword: '나루토',
      priceGraph: {
        dataPoints: [
          {
            date: '2025-01-15 04:00:00',
            registeredPrice: 41250,
            soldPrice: 37125,
            dealCount: 3,
          },
          {
            date: '2025-01-15 08:00:00',
            registeredPrice: 43000,
            soldPrice: 38700,
            dealCount: 5,
          },
          {
            date: '2025-01-15 12:00:00',
            registeredPrice: 45000,
            soldPrice: 40500,
            dealCount: 4,
          },
          {
            date: '2025-01-15 16:00:00',
            registeredPrice: 47500,
            soldPrice: 42750,
            dealCount: 6,
          },
          {
            date: '2025-01-15 20:00:00',
            registeredPrice: 46000,
            soldPrice: 41400,
            dealCount: 4,
          },
          {
            date: '2025-01-15 24:00:00',
            registeredPrice: 48500,
            soldPrice: 43650,
            dealCount: 7,
          },
        ],
      },
      weeklyStats: {
        averagePrice: 45208,
        highestPrice: 48500,
        lowestPrice: 41250,
        totalDeals: 29,
      },
      similarProducts: [],
    },
    error: undefined,
  };

  const weeklyMockData: MarketPriceSearchResponse = {
    success: true,
    data: {
      keyword: '나루토',
      priceGraph: {
        dataPoints: [
          {
            date: '2025-01-09',
            registeredPrice: 41250,
            soldPrice: 37125,
            dealCount: 16,
          },
          {
            date: '2025-01-10',
            registeredPrice: 45000,
            soldPrice: 40500,
            dealCount: 12,
          },
          {
            date: '2025-01-11',
            registeredPrice: 43000,
            soldPrice: 38700,
            dealCount: 14,
          },
          {
            date: '2025-01-12',
            registeredPrice: 47500,
            soldPrice: 42750,
            dealCount: 11,
          },
          {
            date: '2025-01-13',
            registeredPrice: 46000,
            soldPrice: 41400,
            dealCount: 13,
          },
          {
            date: '2025-01-14',
            registeredPrice: 48500,
            soldPrice: 43650,
            dealCount: 15,
          },
          {
            date: '2025-01-15',
            registeredPrice: 50000,
            soldPrice: 45000,
            dealCount: 10,
          },
        ],
      },
      weeklyStats: {
        averagePrice: 45892,
        highestPrice: 50000,
        lowestPrice: 41250,
        totalDeals: 91,
      },
      similarProducts: [],
    },
    error: undefined,
  };

  return (
    <div className="flex flex-col space-y-8">
      <PriceList
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={(period) => setSelectedPeriod(period as Period)}
        priceData={selectedPeriod === '1일' ? dailyMockData : weeklyMockData}
      />
      <Chart
        data={selectedPeriod === '1일' ? dailyMockData : weeklyMockData}
        period={selectedPeriod}
      />
      <RecentlyTradedProduct />
      <RelatedProduct />
    </div>
  );
};

export default MarketPricePage;
