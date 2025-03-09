import { useState } from 'react';

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
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import DeleteAlertDialog from '@/components/alert-dialog/DeleteAlertDialog';
import FallbackImage from '@/components/avatar/FallbackImage';
import CommuCommentList from '@/components/comments/community/CommuCommentList';
import CommuCommentMainForm from '@/components/comments/community/CommuCommentMainForm';
import ReportDialog from '@/components/report/ReportDialog';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import SectionLayout from '@/layout/SectionLayout';
import { formatKoreanDateWithLimit } from '@/lib/utils';
import {
  useCommunityDetail,
  useDeleteCommunityDetail,
  useLikeCommunityDetail,
} from '@/queries/community';
import useUserStore from '@/store/userStore';

const CommunityDetailPage = () => {
  const { category, id } = useParams();

  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {
    data: communityDetailInfo,
    isPending,
    error,
    refetch: refetchCommunityDetail,
  } = useCommunityDetail(id ?? '');

  const { mutate } = useDeleteCommunityDetail({
    postId: id ?? '',
    onSuccessCb: () => {
      navigate(`/community/${category}`);
    },
  });

  const { mutate: likeCommunityDetail } = useLikeCommunityDetail({
    postId: id ?? '',
    onSuccessCb: () => {
      refetchCommunityDetail();
    },
  });

  const handleClickedLike = () => {
    if (!user) {
      return toast.error('로그인이 필요한 서비스입니다.');
    }
    likeCommunityDetail();
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const onClickEdit = () => {
    navigate(`/community/${category}/${id}/edit`);
  };

  const onClickDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteCommunityDetail = () => {
    mutate();
  };

  return (
    <SectionLayout>
      <div className="mt-10 flex flex-col" style={{ wordBreak: 'break-word' }}>
        <Button
          variant={'ghost'}
          className="w-fit font-bold"
          onClick={() => navigate(`/community/${category}`)}
        >
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
              {communityDetailInfo.data?.owner ? (
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
              ) : (
                <ReportDialog />
              )}
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Avatar>
              <AvatarImage
                src={communityDetailInfo.data?.authorProfileUrl}
                alt={'aa'}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p>{communityDetailInfo.data?.authorNickname}</p>
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
              <p>{communityDetailInfo.data?.comments.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        {/* content pre-wrap */}
        <div className="min-h-40 whitespace-pre-wrap">
          {communityDetailInfo.data?.content}
        </div>
        {/* 이미지 캐러샐 */}
        {communityDetailInfo.data?.imageUrls.length > 0 && (
          <div>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {communityDetailInfo.data?.imageUrls.map(
                  (imageUrl: string, index: number) => (
                    <CarouselItem
                      key={index}
                      // 3개 이상일 경우 basis-1/3 미만의 경우 2개인 경우 basis-1/2 1개인 경우 basis-full
                      className={
                        communityDetailInfo.data?.imageUrls.length > 2
                          ? 'basis-1/3'
                          : 'basis-1/2'
                      }
                    >
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <FallbackImage
                              src={imageUrl}
                              alt="image"
                              className="w-full object-cover"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ),
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
        {/* 좋아요 및 신고 */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            onClick={handleClickedLike}
          >
            <Heart
              color="#d32f2f"
              fill={communityDetailInfo.data?.liked ? '#d32f2f' : 'none'}
            />
            좋아요
          </Button>
          {!communityDetailInfo.data?.owner && <ReportDialog />}
        </div>
      </div>
      <Separator className="my-8" />
      {/* 댓글 */}
      <div>
        <div className="font-bold">
          댓글 {communityDetailInfo.data?.comments.length ?? 0}
        </div>
        <CommuCommentMainForm
          parentId={id ?? ''}
          resetComments={refetchCommunityDetail}
        />
        <CommuCommentList
          parentId={id ?? ''}
          commentsArr={communityDetailInfo.data?.comments ?? []}
        />
      </div>
      <Button
        variant="outline"
        className="my-8 h-12 w-full border-2 font-bold"
        onClick={() => navigate(`/community/${category}`)}
      >
        목록으로
      </Button>

      <DeleteAlertDialog
        title="게시글 삭제"
        content="게시글을 완전히 삭제할까요?"
        isDialogOpen={openDeleteDialog}
        setIsDialogOpen={setOpenDeleteDialog}
        handleClickDelete={handleDeleteCommunityDetail}
      />
    </SectionLayout>
  );
};

export default CommunityDetailPage;
