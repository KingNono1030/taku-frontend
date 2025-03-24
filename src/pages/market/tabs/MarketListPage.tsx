import { useCallback, useRef, useState } from 'react';

import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FallbackImage from '@/components/avatar/FallbackImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { CATEGORY_MAP } from '@/constants/jangter';
import { useProductItems } from '@/queries/jangter';
import useUserStore from '@/store/userStore';
import { FindProductItemsQuery } from '@/types/api/jangter.types';

export interface ProductItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  userNickname: string;
  viewCount: number;
  status: string;
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_MAP).map(([value, label]) => ({
  value,
  label,
}));

const SORT_OPTIONS = [
  { value: 'day', label: '최신순' },
  { value: 'price', label: '가격순' },
];

const ORDER_OPTIONS = [
  { value: 'desc', label: '내림차순' },
  { value: 'asc', label: '오름차순' },
];

const STATUS_ARR = [
  { value: 'FOR_SALE', label: '판매중', bgColor: 'bg-green-600' },
  {
    value: 'SOLD_OUT',
    label: '판매완료',
    bgColor: 'bg-gray-500',
  },
  { value: 'RESERVED', label: '예약중', bgColor: '' },
];

interface FilterForm {
  categoryId: string;
  sort: string;
  order: string;
  searchKeyword: string;
  priceRange: [number, number];
}

type ItemsProps = {
  item: ProductItem;
  itemsLength: number;
  lastItemRef: React.RefObject<HTMLDivElement> | null;
  index: number;
};

export const ItemCard = ({
  item,
  itemsLength,
  lastItemRef,
  index,
}: ItemsProps) => {
  return (
    <div ref={index === itemsLength - 1 ? lastItemRef : null} key={item.id}>
      <Link to={`/market/${item.id}`}>
        <Card>
          <div className="relative aspect-square w-full overflow-hidden">
            <FallbackImage
              src={item.imageUrl}
              alt={item.title}
              className="w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          <CardHeader className="p-4">
            <CardDescription>{item.title}</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <CardTitle className="">{item.price.toLocaleString()}원</CardTitle>
          </CardContent>
          <CardFooter className="px-4 pb-4">
            <span className="text-gray-400">{item.userNickname}</span>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};

const MarketListPage = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FilterForm>({
    defaultValues: {
      categoryId: '',
      sort: 'day',
      order: 'desc',
      searchKeyword: '',
      priceRange: [0, 1000000],
    },
  });

  const [queryParams, setQueryParams] = useState<
    Omit<FindProductItemsQuery, 'lastId'>
  >({
    size: 20,
    sort: 'day',
    order: 'desc',
    minPrice: 100,
    maxPrice: 50000000,
    categoryId: undefined,
    searchKeyword: '',
  });

  const user = useUserStore((state) => state.user);

  const { data, fetchNextPage, isFetchingNextPage } =
    useProductItems(queryParams);

  const observer = useRef<IntersectionObserver>();

  const lastItemCallbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0 },
      );

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, isFetchingNextPage],
  );
  const allItems = (data?.pages.flatMap((page) => page.data) ??
    []) as ProductItem[];

  const onSubmit = (data: FilterForm) => {
    setQueryParams({
      ...queryParams,
      categoryId: data.categoryId ? Number(data.categoryId) : undefined,
      sort: data.sort,
      order: data.order,
      searchKeyword: data.searchKeyword || undefined,
      minPrice: data.priceRange[0],
      maxPrice: data.priceRange[1],
    });
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div>
        <h1 className="text-3xl font-bold">더쿠장터 판매글 전체 조회</h1>
      </div>

      {/* 필터 섹션 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">필터 및 검색</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={watch('sort')}
              onValueChange={(value) => setValue('sort', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={watch('order')}
              onValueChange={(value) => setValue('order', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex w-full max-w-sm items-center gap-2">
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                {...register('searchKeyword')}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">가격 범위</label>
              <span className="text-sm text-gray-500">
                {watch('priceRange')[0].toLocaleString()}원 ~{' '}
                {watch('priceRange')[1].toLocaleString()}원
              </span>
            </div>
            <Slider
              value={watch('priceRange')}
              defaultValue={[0, 1000000]}
              max={1000000}
              step={1000}
              onValueChange={(value) =>
                setValue('priceRange', value as [number, number])
              }
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="default">
              필터 적용
            </Button>
          </div>
        </form>
      </section>

      {/* 상품 목록 섹션 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">상품 목록</h2>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allItems.map((item: ProductItem, index: number) => (
            <div
              ref={index === allItems.length - 1 ? lastItemCallbackRef : null}
              key={item.id}
            >
              <Link to={`/market/${item.id}`}>
                <Card>
                  <div className="relative aspect-square w-full overflow-hidden">
                    <FallbackImage
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <Badge
                      className={
                        'absolute left-4 top-4 ' +
                        STATUS_ARR.find(
                          (status) => status.value === item?.status,
                        )?.bgColor
                      }
                    >
                      {
                        STATUS_ARR.find(
                          (status) => status.value === item?.status,
                        )?.label
                      }
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardDescription>{item.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <CardTitle className="">
                      {item.price.toLocaleString()}원
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="px-4 pb-4">
                    <span className="text-gray-400">{item.userNickname}</span>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="mt-4 text-center">로딩중...</div>
        )}
      </section>

      {/* 글쓰기 버튼 */}
      {user && (
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
      )}
    </div>
  );
};

export default MarketListPage;
