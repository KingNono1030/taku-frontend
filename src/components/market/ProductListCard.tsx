import { Eye, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatCurrency } from '@/lib/utils';
import { JangterProduct } from '@/types/api/jangter.types';

import FallbackImage from '../avatar/FallbackImage';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const ProductListCard = ({ data }: { data: JangterProduct }) => {
  const { id, title, price, imageUrl, viewCount, userNickname } = data;
  return (
    <Link to={`/market/${id}`}>
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden">
          {imageUrl && (
            <FallbackImage
              src={imageUrl}
              alt={`${title} 상품 썸네일`}
              className="w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          )}
          {!imageUrl && (
            <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
              <ImageOff size={64} color="#b1b1b1" />
            </div>
          )}
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center gap-1 text-gray-400">
            <Eye className="h-4 w-4" />
            {viewCount}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <CardDescription>{title}</CardDescription>
          <span className="text-gray-400">{userNickname}</span>
        </CardContent>
        <CardFooter className="flex flex-col items-start px-4 pb-4">
          <CardTitle className="">{formatCurrency(price as number)}</CardTitle>
        </CardFooter>
      </Card>
    </Link>
  );
};
