import { ProductStatus } from '@/types/api/jangter.types';

export const CATEGORY_MAP: Record<number, string> = {
  1: '디지털 기기',
  2: '가구/인테리어',
  3: '여성의류',
  4: '여성잡화',
  5: '남성패션/잡화',
  6: '생활가전',
  7: '생활/주방',
  8: '취미/게임/음반',
  9: '뷰티/미용',
  10: '도서',
  11: '기타 중고물품',
};

export const STATUS_MAP: Record<ProductStatus, string> = {
  FOR_SALE: '판매중',
  RESERVED: '예약중',
  SOLD_OUT: '판매 완료',
};
