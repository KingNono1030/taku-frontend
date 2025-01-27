import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Bookmark, BookmarkCheck, ChevronLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

import TestImg from '@/assets/스크린샷.png';
import DataTable from '@/components/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { testAxios } from '@/lib/axiosInstance';

const getDetailCategory = async (category: string) => {
  const response = await testAxios.get(`/api/category/${category}`);
  return response.data;
};

type Gerne = {
  id: number;
  name: string;
};

const CommunityCategoryPage = () => {
  const { category } = useParams();

  const [bookmarkChecked, setBookmarkChecked] = useState(false);

  const { data, status, error } = useQuery({
    queryKey: ['category', category],
    queryFn: () => category && getDetailCategory(category),
  });

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
      <section className="flex h-full justify-between">
        <div className="flex flex-col justify-between gap-4">
          <div className="flex flex-col items-start gap-4">
            <Button variant={'ghost'} className="font-bold">
              <ChevronLeft />
              커뮤니티 목록으로
            </Button>
            <h1 className="text-5xl font-bold">{data.data.name}</h1>
            <div className="flex items-center gap-2">
              {data.data.categoryGenres.map((genre: Gerne) => (
                <Badge key={genre.id} variant={'outline'} className="text-lg">
                  #{genre.name}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant={bookmarkChecked ? 'default' : 'ghost'}
            size={'icon'}
            onClick={() => setBookmarkChecked(!bookmarkChecked)}
            className="h-12 w-12 rounded-full [&_svg]:size-8"
          >
            {bookmarkChecked ? (
              <BookmarkCheck strokeWidth={2} />
            ) : (
              <Bookmark strokeWidth={2} />
            )}
          </Button>
        </div>
        <div className="flex items-center bg-slate-500">
          <div className="relative h-[400px] w-[600px] overflow-hidden">
            <img
              src={TestImg}
              alt="아무거나"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute left-[-3%] top-[-2%] h-[102%] w-[70%] bg-gradient-to-r from-white via-white/30 to-transparent"></div>

            <div className="via-white/86 absolute bottom-0 left-0 top-[33%] h-[68%] w-full bg-gradient-to-t from-white via-white/30 to-transparent"></div>
          </div>
        </div>
      </section>
      <Separator className="my-4" />
      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default CommunityCategoryPage;
