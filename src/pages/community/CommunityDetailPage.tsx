import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  EllipsisVertical,
  Eye,
  Heart,
  MessageSquareText,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import SectionLayout from '@/layout/SectionLayout';
import ducku from '@/lib/axiosInstance';
import { formatKoreanDateWithLimit } from '@/lib/utils';

const getCommunityDetail = async (postId: string) => {
  const { data } = await ducku.get(
    `/api/community/posts/${postId}?canAddView=true`,
  );
  return data;
};

const CommunityDetailPage = () => {
  const { category, id } = useParams();

  const [isLike, setIsLike] = useState(false);

  console.log('category:', category);
  console.log('id:', id);

  const {
    data: communityDetailInfo,
    isPending,
    error,
  } = useQuery({
    queryKey: ['communityDetail', id],
    queryFn: () => id && getCommunityDetail(id),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const onClickEdit = () => {
    console.log('edit');
  };

  const onClickDelete = () => {
    console.log('delete');
  };

  return (
    <SectionLayout>
      <div className="mt-10 flex flex-col" style={{ wordBreak: 'break-word' }}>
        <Button variant={'ghost'} className="w-fit font-bold">
          <ChevronLeft />
          뒤로가기
        </Button>
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1
            className="text-2xl font-bold"
            style={{ wordBreak: 'break-word' }}
          >
            {communityDetailInfo.data?.title}
          </h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                // svg 크기 조절
                className="h-12 w-12 rounded-full [&_svg]:size-6"
              >
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-fit px-2 py-0">
              <ul className="flex flex-col">
                <li>
                  <Button variant="ghost" onClick={onClickEdit}>
                    <Pencil />
                    수정
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={onClickDelete}>
                    <Trash2 />
                    삭제
                  </Button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Avatar>
              <AvatarImage src={'https://github.com/shadcn.png'} alt={'aa'} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p>홍길동</p>
            <p className="text-stone-500">
              {formatKoreanDateWithLimit(communityDetailInfo.data?.updateAt)}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Eye />
              <p>{communityDetailInfo.data?.viewCount ?? 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart />
              <p>{communityDetailInfo.data?.likeCount ?? 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareText />
              <p>{communityDetailInfo.data?.comments.lenght ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        {/* content pre-wrap */}
        <div className="whitespace-pre-wrap">
          {communityDetailInfo.data?.content}
        </div>
        {/* 이미지 캐러샐 */}
        <div>
          <Carousel
            opts={{
              align: 'start',
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        {/* 좋아요 및 신고 */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            onClick={() => setIsLike(!isLike)}
          >
            <Heart color="#d32f2f" fill={isLike ? '#d32f2f' : 'none'} />
            좋아요
          </Button>
          <div
            className="cursor-pointer font-bold text-stone-500 hover:text-stone-700"
            onClick={() => console.log('신고')}
          >
            신고
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      {/* 댓글 */}
      <div>
        <div>댓글 {communityDetailInfo.data?.comments.length ?? 0}</div>
        <div className="relative mx-auto my-10">
          <Button
            variant="ghost"
            className="absolute right-5 top-1/2 h-8 w-8 -translate-y-1/2 transform text-muted-foreground"
          >
            게시
          </Button>
          <Input placeholder={'댓글을 입력해주세요...'} className="pl-5" />
        </div>
        <div></div>
      </div>
      <Button
        variant="outline"
        className="h-12 w-full border-2 border-primary font-bold text-primary hover:text-primary"
        onClick={() => console.log('comment')}
      >
        목록으로
      </Button>
    </SectionLayout>
  );
};

export default CommunityDetailPage;
