import { Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CATEGORY_MAP } from '@/constants/jangter';
import { formatCurrency } from '@/lib/utils';
import { useDeleteBookmark } from '@/queries/jangter';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const JangterBookMarkCard = ({
  data,
  bookmarksQueries,
}: {
  data: {
    productId?: number;
    title?: string;
    price?: number;
    viewCount?: number;
    categoryId?: number;
    imageUrl?: string;
  };
  bookmarksQueries: {
    categoryId: number;
    page?: number;
    size?: number;
    sort?: string[];
  };
}) => {
  const { productId, title, price, categoryId } = data;

  const { mutate } = useDeleteBookmark(productId as number, bookmarksQueries);
  return (
    <div className="flex w-full items-center gap-2">
      <Link to={`/market/${productId}`} className="flex-grow">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>{title}</CardDescription>
            <span className="text-gray-400">
              {CATEGORY_MAP[categoryId as number]}
            </span>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <CardTitle className="">
              {formatCurrency(price as number)}
            </CardTitle>
          </CardContent>
          <CardFooter className="flex flex-col items-start px-4 pb-4"></CardFooter>
        </Card>
      </Link>
      <Button variant={'secondary'} onClick={() => mutate()}>
        <Trash />
      </Button>
    </div>
  );
};
