import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ducku } from '@/lib/axiosInstance';
import type {
  MarketPriceProps,
  MarketPriceSearchResponse,
} from '@/types/market-price-type/marketPrice.types';

const fetchMarketPriceSearch = async (params: MarketPriceProps) => {
  try {
    const response = await ducku.get<MarketPriceSearchResponse>(
      '/api/market-price/search',
      { params },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error('API 엔드포인트를 찾을 수 없습니다.');
      }
      throw new Error(
        error.response?.data?.message || '시세 정보를 불러오는데 실패했습니다.',
      );
    }
    throw error;
  }
};

export const useMarketPriceSearch = (
  keyword: string | null,
  startDate: Date,
  endDate: Date,
) => {
  return useQuery({
    queryKey: ['marketPrice', keyword, startDate, endDate],
    queryFn: () =>
      fetchMarketPriceSearch({
        keyword: keyword || '원피스',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        displayOption: 'ALL',
        direction: 'ASC',
        page: 0,
        size: 10,
      }),
  });
};
