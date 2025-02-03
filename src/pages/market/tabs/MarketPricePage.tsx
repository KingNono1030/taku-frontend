import { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Chart } from '@/components/market-price/Chart';
import { PriceList } from '@/components/market-price/PriceList';
import { RecentlyTradedProduct } from '@/components/market-price/RecentlyTradedProduct';
import { RelatedProduct } from '@/components/market-price/RelatedProduct';
import { testAxios } from '@/lib/axiosInstance';
import {
  MarketPriceProps,
  MarketPriceSearchResponse,
} from '@/types/market-price-type/marketPrice.types';

const MarketPricePage = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [priceData, setPriceData] = useState<MarketPriceSearchResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePeriodChange = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
    }
  };

  const fetchMarketPriceSearch = async (params: MarketPriceProps) => {
    try {
      const response = await testAxios.get<MarketPriceSearchResponse>(
        '/api/market-price/search',
        { params },
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
        keyword: '원피스',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        displayOption: 'ALL',
        direction: 'ASC',
        page: 0,
        size: 10,
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
  }, [startDate, endDate]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!priceData || !priceData.data) return null;

  const defaultWeeklyStats = {
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    totalDeals: 0,
  };

  return (
    <div className="flex flex-col space-y-8">
      <PriceList
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={handlePeriodChange}
        priceData={priceData}
      />
      <div className="flex items-center gap-4">
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          locale={ko}
          className="rounded-md border border-border/50 px-3 py-2"
        />
        <span>~</span>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          locale={ko}
          className="rounded-md border border-border/50 px-3 py-2"
        />
      </div>
      <Chart data={priceData} startDate={startDate} endDate={endDate} />

      <RecentlyTradedProduct
        weeklyStats={priceData.data.weeklyStats ?? defaultWeeklyStats}
      />
      <RelatedProduct similarProducts={priceData.data.similarProducts ?? []} />
    </div>
  );
};

export default MarketPricePage;
