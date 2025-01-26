import { CommonResponse } from './common.types';
import { SimilarProduct } from './similarProduct';
import { WeeklyStats } from './weeklyStats';

// 시세 데이터 포인트 타입 (날짜별 데이터)
export interface PriceDataPoint {
  date?: string;
  productId?: number;
  title?: string;
  registeredPrice?: number; // 등록 가격
  soldPrice?: number; // 판매 가격
  dealCount?: number; // 거래 건수
}

export interface PriceGraph {
  dataPoints?: PriceDataPoint[];
}

export interface MarketPriceSearch {
  keyword?: string;
  priceGraph?: PriceGraph;
  weeklyStats?: WeeklyStats;
  similarProducts?: SimilarProduct[];
}

// 시세 그래프 응답 타입
export type PriceGraphResponse = CommonResponse<PriceGraph>;

// 시세 검색 응답 타입
export type MarketPriceSearchResponse = CommonResponse<MarketPriceSearch>;

export interface MarketPriceProps {
  keyword: string;
  graph: PriceGraph;
  stats: WeeklyStats;
  products: SimilarProduct[];
}

export type Period = '1일' | '1주일';
