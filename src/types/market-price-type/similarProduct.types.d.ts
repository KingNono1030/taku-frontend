import { CommonResponse } from './common.types';

export interface SimilarProduct {
  productId?: number;
  title?: string;
  price?: number;
  tfidfVector?: string;
  imageUrl?: string;
}

// 유사 상품 목록 응답 타입
export type SimilarProductListResponse = CommonResponse<SimilarProduct[]>;

export interface SimilarProductProps {
  products: SimilarProduct[];
}
