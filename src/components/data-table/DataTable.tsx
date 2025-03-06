import { useEffect, useState } from 'react';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ImageOff, SquarePen, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { duckuWithoutAuth } from '@/lib/axiosInstance';
import { formatKoreanDateWithLimit } from '@/lib/utils';

import PaginationComponent from '../custom-pagination/CustomPagination';
import DropdownFilter from '../dropdown-filter/DropdownFilter';
import { COMMUNITY_FILTERS } from '../dropdown-filter/FilterConfig';
import SearchBar from '../search-bar/SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

type Post = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  content: string;
  imageUrl: string;
  updatedAt: string;
  views: number;
  likes: number;
  userNickname: string;
  userImageUrl: string;
};

const getCommunityPosts = async (
  page: number,
  sort = 'id,desc',
  size = 20,
  keyword: string,
  categoryId: string,
) => {
  const response = await duckuWithoutAuth.get('/api/community/posts', {
    params: {
      page,
      sort,
      size,
      keyword,
      categoryId,
    },
  });
  return response.data;
};

const DataTable = () => {
  const { category } = useParams();

  const quiryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(
    COMMUNITY_FILTERS[0].value,
  );

  const { status, data, error, isPlaceholderData } = useQuery({
    queryKey: [
      'communityPosts',
      page,
      selectedFilter + ',desc',
      20,
      search,
      category,
    ],
    queryFn: () =>
      getCommunityPosts(
        page,
        selectedFilter + ',desc',
        20,
        search,
        category ?? '',
      ),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handleClickedPost = (postId: number) => {
    navigate(`/community/${category}/${postId}`);
  };

  const handleMoveCreatePost = () => {
    navigate(`/community/${category}/add`);
  };

  // 다음 페이지를 미리 가져옵니다!
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      quiryClient.prefetchQuery({
        queryKey: [
          'communityPosts',
          page + 1,
          selectedFilter + ',desc',
          10,
          search,
          category,
        ],
        queryFn: () =>
          getCommunityPosts(
            page + 1,
            selectedFilter + ',desc',
            10,
            search,
            category ?? '',
          ),
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
    <div>
      <SearchBar search={search} setSearch={setSearch} />
      <div className="mb-4 flex justify-end">
        <Button className="font-bold" onClick={handleMoveCreatePost}>
          <SquarePen />
          글쓰기
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-base font-bold">
          전체 {data.data?.totalPages ?? 0}개
        </p>
        <DropdownFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filterArr={COMMUNITY_FILTERS}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 text-center font-bold">번호</TableHead>
            <TableHead className="text-center font-bold">제목</TableHead>
            <TableHead className="w-[200px] text-center font-bold">
              작성자
            </TableHead>
            <TableHead className="w-[150px] text-center font-bold">
              작성일
            </TableHead>
            <TableHead className="w-[100px] text-center font-bold">
              조회수
            </TableHead>
            <TableHead className="w-[100px] text-center font-bold">
              좋아요수
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.responsePostList.map((post: Post) => (
            <TableRow
              key={post.id}
              className="cursor-pointer"
              onClick={() => handleClickedPost(post.id)}
            >
              <TableCell className="text-center">{post.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-lg">
                    <AvatarImage src={post.imageUrl} alt="@shadcn" />
                    <AvatarFallback className="rounded-lg">
                      <ImageOff />
                    </AvatarFallback>
                  </Avatar>
                  {post.title}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={post.userImageUrl} alt="@shadcn" />
                    <AvatarFallback className="rounded-full">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <p>{post.userNickname}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {formatKoreanDateWithLimit(post.updatedAt)}
              </TableCell>
              <TableCell className="text-center">{post.views}</TableCell>
              <TableCell className="text-center">{post.likes}</TableCell>
            </TableRow>
          ))}
          {data.data.responsePostList.length === 0 && (
            <TableRow className="font-bold">
              <TableCell
                colSpan={6}
                className="min-h-40 py-40 text-center text-muted-foreground"
              >
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="my-8">
        <PaginationComponent
          totalPages={data.data.totalPages}
          setCurrentPage={setPage}
          currentPage={page}
        />
      </div>
    </div>
  );
};

export default DataTable;
