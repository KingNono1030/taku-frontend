import { useState } from 'react';

import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ProductListCard } from '@/components/market/ProductListCard';
import { Button } from '@/components/ui/button';
import { useProductItems } from '@/queries/jangter';
import {
  FindProductItemsQuery,
  JangterProduct,
} from '@/types/api/jangter.types';

const MarketListPage = () => {
  const [queryParams, setQueryParams] = useState<FindProductItemsQuery>({
    lastId: undefined,
    size: 20,
    sort: 'day',
    order: 'desc',
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: undefined,
    searchKeyword: undefined,
  });

  const { data } = useProductItems(queryParams);
  const productItems = data?.data as JangterProduct[];
  // 무한 스크롤 핸들러
  const handleLoadMore = (lastItemId: number) => {
    setQueryParams((prev) => ({
      ...prev,
      lastId: lastItemId,
    }));
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort: string, order: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sort,
      order,
      lastId: undefined, // 정렬 변경 시 처음부터 다시 로드
    }));
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (searchKeyword: string) => {
    setQueryParams((prev) => ({
      ...prev,
      searchKeyword,
      lastId: undefined, // 검색 시 처음부터 다시 로드
    }));
  };

  // 가격 필터 핸들러
  const handlePriceFilter = (minPrice?: number, maxPrice?: number) => {
    setQueryParams((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
      lastId: undefined, // 필터 변경 시 처음부터 다시 로드
    }));
  };

  // 카테고리 필터 핸들러
  const handleCategoryChange = (categoryId?: number) => {
    setQueryParams((prev) => ({
      ...prev,
      categoryId,
      lastId: undefined, // 카테고리 변경 시 처음부터 다시 로드
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">상품 조회/검색 탭 입니다.</h1>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productItems &&
          productItems.length > 0 &&
          productItems.map((item: JangterProduct) => (
            <ProductListCard key={item.id} data={item} />
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
