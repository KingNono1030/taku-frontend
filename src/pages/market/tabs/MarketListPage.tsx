import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const MarketListPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">상품 조회/검색 탭 입니다.</h1>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from(new Array(41))
          .map((_, i) => i + 1)
          .map((num: number) => (
            <Link to={`/market/${num}`} key={num}>
              <Card>
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    className="w-full object-cover transition-transform duration-300 hover:scale-110"
                    src="https://fastly.picsum.photos/id/1051/200/200.jpg?hmac=s6d4ypEjpec8nvA2zqhWzx_6ogXYM2fJ_YJwaOM1CUA"
                    alt=""
                  />
                </div>
                <CardHeader className="p-4">
                  <CardDescription>
                    한섬 타임 TIME 캐시미어 100% 코트
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <CardTitle className="">22000원</CardTitle>
                </CardContent>
                <CardFooter className="px-4 pb-4">
                  <span className="text-gray-400">3초 전</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
      <div className="group fixed bottom-10 right-10">
        <Link to={'/market/add'}>
          <Button
            asChild
            className="relative z-20 rounded-full shadow-lg shadow-slate-400 transition-transform duration-300 group-hover:translate-x-8"
            size={'icon'}
          >
            <Plus />
          </Button>
          <div className="absolute -right-2 bottom-1/2 z-10 w-[140px] translate-y-1/2 rounded bg-gray-100/50 px-3 py-2 font-semibold text-black opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            장터 게시글 추가
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MarketListPage;
