import React, { useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import { subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearchParams } from 'react-router-dom';

import { Chart } from '@/components/market-price/Chart';
import { PriceList } from '@/components/market-price/PriceList';
import { RecentlyTradedProduct } from '@/components/market-price/RecentlyTradedProduct';
import { RelatedProduct } from '@/components/market-price/RelatedProduct';
import { Input } from '@/components/ui/input';
import { ducku } from '@/lib/axiosInstance';
import {
  MarketPriceProps,
  MarketPriceSearchResponse,
} from '@/types/market-price-type/marketPrice.types';

const MarketPricePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();
  const oneYearAgo = subMonths(today, 12);

  const [startDate, setStartDate] = useState<Date>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date>(today);
  const [priceData, setPriceData] = useState<MarketPriceSearchResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    const inputElement =
      e.type === 'keydown'
        ? (e as React.KeyboardEvent<HTMLInputElement>).currentTarget
        : (document.querySelector('input[type="text"]') as HTMLInputElement);

    if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') {
      return;
    }

    const keyword = inputElement.value;
    if (keyword.trim()) {
      setSearchParams({ keyword: keyword });
    }
  };

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
      const response = await ducku.get<MarketPriceSearchResponse>(
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
      const keyword = searchParams.get('keyword') || '원피스';
      const params: MarketPriceProps = {
        keyword: keyword,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        displayOption: 'ALL',
        direction: 'ASC',
        page: 0,
        size: 10,
      };

      try {
        setIsLoading(true);
        const result = await fetchMarketPriceSearch(params);
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
  }, [startDate, endDate, searchParams]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!priceData || !priceData.data) return null;

  const defaultWeeklyStats = {
    averagePrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    totalDeals: 0,
  };

  const calendarClassName = '!fixed-height-calendar';

  return (
    <div className="flex flex-col space-y-8">
      {/* Search Bar */}
      <div className="relative mx-auto my-[80px] w-full max-w-[560px]">
        <Input
          placeholder="검색하기..."
          className="rounded-full pl-5"
          defaultValue={searchParams.get('keyword') || ''}
          onKeyDown={handleSearch}
        />
        <button
          onClick={handleSearch}
          className="absolute right-5 top-1/2 -translate-y-1/2 transform"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <PriceList
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={handlePeriodChange}
        priceData={priceData}
      />
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          조회기간 선택
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate}
              dateFormat="yyyy-MM-dd"
              locale={ko}
              calendarClassName={calendarClassName}
              className="w-40 rounded-md border border-border/50 px-3 py-2 text-gray-900 placeholder:text-gray-400"
              showPopperArrow={false}
              fixedHeight
              placeholderText="시작일 선택"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={today}
              dateFormat="yyyy-MM-dd"
              locale={ko}
              calendarClassName={calendarClassName}
              className="w-40 rounded-md border border-border/50 px-3 py-2 text-gray-900 placeholder:text-gray-400"
              showPopperArrow={false}
              fixedHeight
              placeholderText="종료일 선택"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
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
