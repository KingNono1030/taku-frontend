import { useEffect, useState } from 'react';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Bookmark, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DeleteAlertDialog from '@/components/alert-dialog/DeleteAlertDialog';
import FallbackImage from '@/components/avatar/FallbackImage';
import CategoryDialog from '@/components/category/CategoryDialog';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import SearchBar from '@/components/search-bar/SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SectionLayout from '@/layout/SectionLayout';
import { duckuWithoutAuth } from '@/lib/axiosInstance';
import { useCommunityBookmark } from '@/queries/community';
import { deleteCommunityBookmark } from '@/services/community';
import useUserStore from '@/store/userStore';

import PaginationComponent from '../../components/custom-pagination/CustomPagination';

// https://api-duckwho.xyz/api/category?page=0&size=20&sort=name%2Casc&name

const getCategory = async (
  page: number,
  size = 20,
  sort: string,
  name: string,
) => {
  const response = await duckuWithoutAuth.get('/api/category', {
    params: {
      page,
      size,
      sort,
      name,
    },
  });
  return response.data;
};

type Category = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  viewCount: number;
  categoryCreateUserId: number;
  categoryCreateNickname: string;
  categoryCreateUserProfileImageUrl: string;
  imageId: number;
  imageUrl: string;
  genreId: number[];
  genreName: string[];
};

export const PopularCategories = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['category', 'popular'],
    queryFn: () => getCategory(0, 4, 'viewCount,desc', ''),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data?.data?.content?.map((category: Category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

const BookmarkList = () => {
  const { data, error, isPending, refetch } = useCommunityBookmark();

  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);

  const handleMoveToCategory = (categoryId: number) => {
    navigate(`/community/${categoryId}`);
  };

  const handleDeleteDialogOpen = (categoryId: number) => {
    setBookmarkId(categoryId);
    setIsDialogOpen(true);
  };

  const handleDeleteBookmark = () => {
    if (bookmarkId) {
      deleteCommunityBookmark(bookmarkId.toString()).then(() => {
        refetch();
      });
    }
    setIsDialogOpen(false);
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div></div>;
  }

  return (
    <div className="flex-col space-y-6">
      {data.data?.categoryBookmarks?.length > 0 &&
        data.data?.categoryBookmarks?.map((item: any) => (
          <div
            key={item.bookmarkId}
            className="flex w-full items-center justify-between"
          >
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => handleMoveToCategory(item.categoryId)}
            >
              <Avatar className="rounded-xl">
                <AvatarImage
                  src={item.categoryImageUrl}
                  alt={item.categoryName}
                />
                <AvatarFallback>
                  <ImageOff />
                </AvatarFallback>
              </Avatar>
              <span
                className="cursor-pointer text-sm font-semibold transition-colors duration-100 hover:text-primary"
                onClick={() => {
                  console.log('click');
                }}
              >
                {item.categoryName}
              </span>
            </div>
            <Button
              variant={'ghost'}
              size="icon"
              className="[&_svg]:size-6"
              onClick={() => handleDeleteDialogOpen(item.categoryId)}
            >
              <Bookmark fill={'#EAB308'} />
            </Button>
          </div>
        ))}
      <DeleteAlertDialog
        title="북마크 삭제"
        content="북마크를 삭제하시겠습니까?"
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleClickDelete={handleDeleteBookmark}
      />
    </div>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  const navigate = useNavigate();

  return (
    <div
      className="transform cursor-pointer space-y-2 transition-transform hover:scale-105"
      onClick={() => {
        navigate(`/community/${category.id}`);
      }}
    >
      <Card className="aspect-video cursor-pointer overflow-hidden rounded bg-[#d3d3d3] transition-opacity hover:opacity-90">
        <FallbackImage src={category.imageUrl} alt={category.name} />
      </Card>
      <div className="space-y-1">
        <h3 className="font-bold">{category.name}</h3>
        {/* 한줄로만 표현하기 나머지 ... */}
        <div className="line-clamp-1 flex flex-wrap gap-1 overflow-hidden text-muted-foreground">
          {category.genreName?.map(
            (genre: any, i: number) =>
              i < 3 && (
                <Badge key={i} className="text-sm" variant={'secondary'}>
                  #{genre}
                </Badge>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

const CommunityPage = () => {
  const quiryClient = useQueryClient();

  const user = useUserStore((state) => state.user);

  const [page, setPage] = useState(0);
  const sort = 'name,asc';
  const [search, setSearch] = useState('');

  const { status, data, error, isPlaceholderData } = useQuery({
    queryKey: ['category', page, 20, sort, search],
    queryFn: () => getCategory(page, 20, sort, search),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  // 다음 페이지를 미리 가져옵니다!
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      quiryClient.prefetchQuery({
        queryKey: ['category', page + 1, 20, sort, search],
        queryFn: () => getCategory(page + 1, 20, sort, search),
      });
    }
  }, [data, isPlaceholderData, page, quiryClient]);

  if (status === 'pending') {
    return <div>로딩중...</div>;
  }

  if (status === 'error') {
    return (
      <div>
        에러:
        {error.message
          ? error.message
          : '데이터를 가져오는 중 오류가 발생했습니다'}
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
                {user ? <BookmarkList /> : <div>로그인이 필요합니다.</div>}
              </div>
            </div>
          </div>
        </aside>
        <SectionLayout>
          {/* Search Bar max 560px */}
          <SearchBar search={search} setSearch={setSearch} />
          {/* Popular Categories */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">인기 카테고리</h2>
            <PopularCategories />
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
              {data?.data?.content?.map((category: Category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
          <div className="my-8">
            <PaginationComponent
              totalPages={data.data.totalPages}
              setCurrentPage={setPage}
              currentPage={page}
            />
          </div>
        </SectionLayout>
        <aside className="w-[260px] bg-background"></aside>
      </div>
    </>
  );
};

export default CommunityPage;
