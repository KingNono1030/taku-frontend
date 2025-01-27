import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';

import { Chart } from '@/components/market-price/Chart';
import { PriceList } from '@/components/market-price/PriceList';
import { RecentlyTradedProduct } from '@/components/market-price/RecentlyTradedProduct';
import { RelatedProduct } from '@/components/market-price/RelatedProduct';
import { testAxios } from '@/lib/axiosInstance';
import {
  MarketPriceProps,
  MarketPriceSearchResponse,
  Period,
} from '@/types/market-price-type/marketPrice.types';

const MarketPricePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1일');
  const [priceData, setPriceData] = useState<MarketPriceSearchResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketPriceSearch = async (params: MarketPriceProps) => {
    try {
      const response = await testAxios.get<MarketPriceSearchResponse>(
        '/api/market-price/search',
        {
          params: params,
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Full error:', error.response);
        if (error.response?.status === 404) {
          throw new Error('API 엔드포인트를 찾을 수 없습니다.');
        }
        throw new Error(
          error.response?.data?.message ||
            '시세 정보를 불러오는데 실패했습니다.',
        );
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const searchParams: MarketPriceProps = {
        keyword: '나루토',
        startDate: '2025-01-09',
        endDate: '2025-01-23',
        displayOption: 'ALL',
        direction: 'ASC',
        page: 0,
        size: 5,
      };

      try {
        setIsLoading(true);
        const result = await fetchMarketPriceSearch(searchParams);
        setPriceData(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('알 수 없는 에러가 발생했습니다.');
        }
        console.error('Error fetching market price:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!priceData || !priceData.data) return null;

  console.log('시세조회 데이터', priceData);

  return (
    <div className="flex flex-col space-y-8">
      <PriceList
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={(period) => setSelectedPeriod(period as Period)}
        priceData={priceData}
      />
      <Chart data={priceData} period={selectedPeriod} />
      <RecentlyTradedProduct
        weeklyStats={
          priceData.data.weeklyStats || {
            averagePrice: 0,
            highestPrice: 0,
            lowestPrice: 0,
            totalDeals: 0,
          }
        }
      />
      <RelatedProduct
        similarProducts={
          priceData.data.similarProducts || [
            {
              productId: '11',
              title: '원피스 루피 피규어',
              price: 21000,
              tfidfVector: '0.5,0.3,0,2',
              imageUrl: 'https://example.com/image.jpg',
            },
          ]
        }
      />
    </div>
  );
};

export default MarketPricePage;
