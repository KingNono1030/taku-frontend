import { Link } from 'react-router-dom';

import { formatCurrency } from '@/lib/utils';
import { JangterUserPurchase } from '@/types/api/jangter.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export const JangterPurchaseCard = ({
  data,
}: {
  data: JangterUserPurchase;
}) => {
  const { title, jangterId, price, categoryName } = data;
  return (
    <Link to={`/market/${jangterId}`}>
      <Card>
        <CardHeader className="p-4">
          <CardDescription>{title}</CardDescription>
          <span className="text-gray-400">{categoryName}</span>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <CardTitle className="">{formatCurrency(price as number)}</CardTitle>
        </CardContent>
        <CardFooter className="flex flex-col items-start px-4 pb-4"></CardFooter>
      </Card>
    </Link>
  );
};
