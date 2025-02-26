import { useQuery } from '@tanstack/react-query';

import { fetchMarketPriceSearch } from '@/services/market-price';
import type { MarketPriceProps } from '@/types/market-price-type/marketPrice.types';

export const useMarketPriceSearch = (
  keyword: string | null,
  startDate: Date,
  endDate: Date,
) => {
  const params: MarketPriceProps = {
    keyword: keyword || '원피스',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    displayOption: 'ALL',
    direction: 'ASC',
    page: 0,
    size: 10,
  };

  return useQuery({
    queryKey: ['marketPrice', params],
    queryFn: () => fetchMarketPriceSearch(params),
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });
};
