import { Link } from 'react-router-dom';

import { CATEGORY_MAP } from '@/constants/jangter';
import { formatCurrency, formatKoreanDate } from '@/lib/utils';
import { RecommendedProduct } from '@/types/api/jangter.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const RecommendProductCard = ({
  data,
}: {
  data: RecommendedProduct;
}) => {
  const {
    product_id,
    title,
    view_count,
    price,
    item_category_id,
    thumbnail_url,
    created_at,
  } = data;
  return (
    <Link to={`/market/${product_id}`}>
      <Card>
        <div className="relative aspect-square w-full overflow-hidden">
          {thumbnail_url && (
            <img
              className="absolute inset-0 w-full object-cover transition-transform duration-300 hover:scale-110"
              src={thumbnail_url}
              alt={`${title} 상품 썸네일`}
            />
          )}
          {!thumbnail_url && (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
              등록된 상품 이미지가 없습니다...
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <CardDescription>{title}</CardDescription>
          <span className="text-gray-400">
            {CATEGORY_MAP[item_category_id as number]}
          </span>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <CardTitle className="">{formatCurrency(price as number)}</CardTitle>
        </CardContent>
        <CardFooter className="flex flex-col items-start px-4 pb-4">
          <div className="text-gray-400">
            {formatKoreanDate(created_at as string)}
          </div>
          <div className="text-gray-400">{`조회 ${view_count}`}</div>
        </CardFooter>
      </Card>
    </Link>
  );
};
