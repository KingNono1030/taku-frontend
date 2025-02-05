import { X } from 'lucide-react';

import CommentContent from '@/components/comments/CommentList';
import CommentMainForm from '@/components/comments/CommentMainForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useShortsComment } from '@/queries/shorts';

import LoadingSpinner from '../loading/LoadingSpinner';

type ShortsCommentsCardProps = {
  shortsId: string;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShortsCommentsCard = ({
  shortsId,
  setOpenComments,
}: ShortsCommentsCardProps) => {
  const {
    data: comments,
    refetch: resetComments,
    isPending,
    error,
  } = useShortsComment(shortsId);

  if (isPending)
    return (
      <Card className="h-full border border-[#ffffff20] bg-transparent text-white">
        <LoadingSpinner />
      </Card>
    );
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <Card className="relative h-full border border-[#ffffff20] bg-transparent text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#ffffff20] px-4 py-1">
        <div className="flex flex-row items-center gap-2">
          <h2 className="font-bold">댓글</h2>
          <p className="text-base">{comments?.data?.length}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpenComments(false)}
          className="rounded-full"
        >
          <X size={64} />
        </Button>
      </CardHeader>
      <CardContent className="mb-12 h-full min-h-[calc(100vh-380px)]">
        <CommentContent commentsArr={comments?.data} />
      </CardContent>
      <CardFooter className="absolute bottom-0 left-0 flex w-full items-start justify-between gap-2 border-t border-[#ffffff20] p-4">
        <CommentMainForm parentId={shortsId} resetComments={resetComments} />
      </CardFooter>
    </Card>
  );
};

export default ShortsCommentsCard;
