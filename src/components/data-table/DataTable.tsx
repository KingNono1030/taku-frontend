import { useEffect, useState } from 'react';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ImageOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { testAxios } from '@/lib/axiosInstance';

import PaginationComponent from '../custom-pagination/CustomPagination';
import DropdownFilter from '../dropdown-filter/DropdownFilter';
import { COMMUNITY_FILTERS } from '../dropdown-filter/FilterConfig';
import SearchBar from '../search-bar/SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Post = {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  content: string;
  imageUrl: string;
  updatedAt: string;
  views: number;
};

const getCommunityPosts = async (
  sortFilterType = 'latest',
  page: number,
  asc = 'false',
  limit = 10,
  keyword: string,
  categoryId: string,
) => {
  const response = await testAxios.get('/api/community/posts', {
    params: {
      sortFilterType,
      page,
      asc,
      limit,
      keyword,
      categoryId,
    },
  });
  return response.data;
};

const asc = 'false';

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
      selectedFilter,
      page,
      asc,
      10,
      search,
      category,
    ],
    queryFn: () =>
      getCommunityPosts(selectedFilter, page, asc, 10, search, category ?? ''),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handleClickedPost = (postId: number) => {
    navigate(`/community/${category}/${postId}`);
  };

  // 다음 페이지를 미리 가져옵니다!
  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      quiryClient.prefetchQuery({
        queryKey: [
          'communityPosts',
          selectedFilter,
          page + 1,
          asc,
          10,
          search,
          category,
        ],
        queryFn: () =>
          getCommunityPosts(
            selectedFilter,
            page + 1,
            asc,
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
      <div>
        <DropdownFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filterArr={COMMUNITY_FILTERS}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 text-center">번호</TableHead>
            <TableHead className="text-center">제목</TableHead>
            <TableHead className="w-[100px] text-center">작성자</TableHead>
            <TableHead className="w-[200px] text-center">작성일</TableHead>
            <TableHead className="w-[100px] text-center">조회수</TableHead>
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
              <TableCell className="font-medium">{post.userId}</TableCell>
              <TableCell className="text-center">{post.updatedAt}</TableCell>
              <TableCell className="text-center">{post.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="my-8">
        <PaginationComponent
          totalPages={2}
          setCurrentPage={setPage}
          currentPage={page}
        />
      </div>
    </div>
  );
};

export default DataTable;
