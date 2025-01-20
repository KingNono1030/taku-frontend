import { useEffect, useState } from 'react';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ChevronDown, Search, Star } from 'lucide-react';

import CategoryDialog from '@/components/category/CategoryDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SectionLayout from '@/layout/SectionLayout';
import { testAxios } from '@/lib/axiosInstance';

import PaginationComponent from '../custom-pagination/CustomPagination';

// https://api-duckwho.xyz/api/category?page=0&size=20&sort=name%2Casc&name

const getCategory = async (
  page: number,
  size = 20,
  sort: string,
  name: string,
) => {
  const response = await testAxios.get('/api/category', {
    params: {
      page,
      size,
      sort,
      name,
    },
  });
  return response.data;
};

const CommunityPage = () => {
  const quiryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const sort = 'name,asc';
  const [search, setSearch] = useState('');

  const { status, data, error, isPlaceholderData } = useQuery({
    queryKey: ['category', page, 20, sort, search],
    queryFn: () => getCategory(page, 20, sort, search),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // Prefetch the next page!
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      quiryClient.prefetchQuery({
        queryKey: ['category', page + 1, 20, sort, search],
        queryFn: () => getCategory(page + 1, 20, sort, search),
      });
    }
  }, [data, isPlaceholderData, page, quiryClient]);

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return (
      <div>
        Error:
        {error.message
          ? error.message
          : 'An error occurred while fetching data'}
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        <aside className="w-[260px] bg-background">
          <div className="space-y-6 py-4">
            <h1 className="text-2xl font-semibold tracking-tight">커뮤니티</h1>
            <div className="flex h-[120px] flex-col items-center justify-center space-y-2 bg-[#F1F5F9] px-2 py-3">
              <p className="text-base font-normal">원하는 카테고리가 없나요?</p>
              <CategoryDialog />
            </div>
            <hr className="" />
            <div>
              <h2 className="mb-4 text-lg font-semibold tracking-tight">
                내 커뮤니티
              </h2>
              <div className="flex-col space-y-6">
                {['주문/배송조회', '주문/배송조회', '주문/배송조회'].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex w-full cursor-pointer items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-10 bg-purple-500" />
                        <span>{item}</span>
                      </div>
                      <Star className="h-6 w-6" />
                    </div>
                  ),
                )}
                <Button variant="ghost" className="w-full">
                  <span>더보기</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <SectionLayout>
          {/* Search Bar max 560px */}
          <div className="relative mx-auto my-[80px] max-w-[560px]">
            <Search className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="검색하기..."
              className="rounded-full pl-5"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>

          {/* Popular Categories */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">인기 카테고리</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                // hover시 약간 커짐
                <div
                  key={i}
                  className="transform cursor-pointer space-y-2 transition-transform hover:scale-105"
                >
                  <Card className="aspect-video bg-[#d3d3d3] transition-opacity hover:opacity-90">
                    <CardContent className="h-full p-0" />
                  </Card>
                  <div className="space-y-1">
                    {/* 제목 최대 2줄 표시 넘어가면 ... */}
                    <h3 className="line-clamp-2 font-medium">카테고리</h3>
                    <p className="text-sm text-muted-foreground">장르</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Search Results */}
          <section>
            <h2 className="mb-6 text-xl font-medium">
              <span className="font-bold text-primary">
                {data.data.totalElements}
              </span>
              개의 커뮤니티가 검색됐덕!
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.data.content.map((category: any, i: number) => (
                <div
                  key={i}
                  className="transform cursor-pointer space-y-2 transition-transform hover:scale-105"
                >
                  <Card className="aspect-video cursor-pointer overflow-hidden rounded bg-[#d3d3d3] transition-opacity hover:opacity-90">
                    <img
                      src={category.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </Card>
                  <div className="space-y-1">
                    <h3 className="font-medium">{category.name}</h3>
                    {/* 한줄로만 표현하기 나머지 ... */}
                    <div className="line-clamp-1 flex flex-wrap gap-1 overflow-hidden text-muted-foreground">
                      {category.genreName.map((genre: any, i: number) => (
                        <Badge key={i} className="text-sm">
                          #{genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="my-8">
            <PaginationComponent
              count={data.data.totalPages}
              setPage={setPage}
              page={page}
            />
          </div>
        </SectionLayout>
        <aside className="w-[260px] bg-background">
          <div className="space-y-4 py-4">
            <div className="px-3">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                필터
              </h2>
              <ScrollArea className="h-auto">
                <div className="space-y-2 p-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                    <Badge variant="secondary">label</Badge>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default CommunityPage;
