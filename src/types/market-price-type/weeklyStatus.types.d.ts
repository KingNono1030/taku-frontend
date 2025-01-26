import { CommonResponse } from './common.types';

export interface WeeklyStats {
  averagePrice?: number;
  highestPrice?: number;
  lowestPrice?: number;
  totalDeals?: number;
}

// 최근 일주일 판매 통계 응답 타입
export type WeeklyStatsResponse = CommonResponse<WeeklyStats>;

export interface WeeklyStatsProps {
  stats: WeeklyStats;
}
