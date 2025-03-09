import { useState } from 'react';

import { MessageCircle, User } from 'lucide-react';
import { toast } from 'sonner';

import DeleteAlertDialog from '@/components/alert-dialog/DeleteAlertDialog';
import ReportButton from '@/components/report/ReportButton';
// 한국어 locale 설정
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  useCommunityDetail,
  useDeleteCommunityComment,
} from '@/queries/community';
import useUserStore from '@/store/userStore';

import CommentButton from '../CommentButton';
import CommuCommentItemForm from './CommuCommentItemForm';

type CommuCommentBaseProps = {
  postId: string;
  commentId: string;
  nickname: string;
  avatarUrl: string;
  postedAt: string;
  comment: string;
  isOwner: boolean;
  hasReply?: boolean;
};

const CommuCommentBase = ({
  postId,
  commentId,
  nickname,
  avatarUrl,
  postedAt,
  comment,
  isOwner,
  hasReply,
}: CommuCommentBaseProps) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const user = useUserStore((state) => state.user);

  const { refetch: resetComments } = useCommunityDetail(postId);

  const { mutate: deleteCommentMutate } = useDeleteCommunityComment({
    commentsId: commentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      setOpenDeleteDialog(false);
    },
  });

  // 댓글 수정 클릭 시
  const handleClickEdit = () => {
    setIsEditing(true);
  };

  // 댓글 수정 취소 시
  const handleCancelEditing = () => {
    setIsEditing(false);
    setOpenCommentForm(false);
  };

  // 댓글 삭제 다이얼로그 열기
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // 댓글 삭제
  const handleDeleteComment = () => {
    deleteCommentMutate();
  };

  return (
    <li className={'flex w-full flex-col'}>
      {isEditing ? (
        <CommuCommentItemForm
          isEditing={isEditing}
          parentId={postId}
          commentContent={comment}
          handleCancelEditing={() => setIsEditing(false)}
          commentId={commentId}
        />
      ) : (
        <div className="flex flex-row items-start gap-2">
          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full justify-between">
              <div className="mt-2 flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={avatarUrl} alt={nickname} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-bold leading-5">{nickname}</p>
                    <p
                      className="text-xs font-bold text-stone-500"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {postedAt}
                    </p>
                  </div>
                </div>
              </div>
              {isOwner ? (
                <CommentButton
                  onClickEdit={handleClickEdit}
                  onClickDelete={handleOpenDeleteDialog}
                />
              ) : (
                <ReportButton />
              )}
            </div>
            <div
              className={
                'flex w-full flex-col items-start gap-1 bg-slate-100 p-4'
              }
            >
              <p className="my-2 whitespace-pre-wrap leading-5">{comment}</p>
              {!hasReply && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!user) {
                      return toast.error('로그인 후 이용해주세요.');
                    }
                    setOpenCommentForm(!openCommentForm);
                  }}
                  className="w-fit font-bold"
                >
                  <MessageCircle />
                  답글
                </Button>
              )}
              {openCommentForm && (
                <CommuCommentItemForm
                  parentId={postId}
                  commentId={commentId}
                  handleCancelEditing={handleCancelEditing}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <DeleteAlertDialog
        title="댓글 삭제"
        content="댓글을 완전히 삭제할까요?"
        isDialogOpen={openDeleteDialog}
        setIsDialogOpen={setOpenDeleteDialog}
        handleClickDelete={handleDeleteComment}
      />
    </li>
  );
};

export default CommuCommentBase;
