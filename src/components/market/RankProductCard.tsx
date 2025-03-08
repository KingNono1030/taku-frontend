import { ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatCurrency } from '@/lib/utils';
import { JangterRank } from '@/types/api/jangter.types';

import FallbackImage from '../avatar/FallbackImage';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const RankProductCard = ({ data }: { data: JangterRank }) => {
  const {
    rank_idx,
    product_id,
    product_name,
    product_image,
    product_price,
    author_name,
  } = data;
  return (
    <Link to={`/market/${product_id}`}>
      <Card className="relative overflow-hidden">
        <div className="absolute left-0 top-0 z-10 flex h-[28px] w-[34px] items-center justify-center rounded-lg bg-black/50 text-xs text-white">
          {rank_idx}
        </div>
        <div className="relative aspect-square w-full overflow-hidden">
          {product_image && (
            <FallbackImage
              src={product_image}
              alt={`${product_name} 상품 썸네일`}
              className="w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          )}
          {!product_image && (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
              <ImageOff size={64} />
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <CardDescription>{product_name}</CardDescription>
          <span className="text-gray-400">{author_name}</span>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <CardTitle className="">
            {formatCurrency(product_price as number)}
          </CardTitle>
        </CardContent>
        <CardFooter className="flex flex-col items-start px-4 pb-4"></CardFooter>
      </Card>
    </Link>
  );
};
