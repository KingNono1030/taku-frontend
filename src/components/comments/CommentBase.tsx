import { useState } from 'react';

import { User } from 'lucide-react';

// 한국어 locale 설정
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useDeleteShortsComment,
  useDeleteShortsCommentReply,
  useShortsComment,
} from '@/queries/shorts';

import DeleteAlertDialog from '../alert-dialog/DeleteAlertDialog';
import ReportButton from '../report/ReportButton';
import { Button } from '../ui/button';
import CommentButton from './CommentButton';
import CommentItemForm from './CommentItemForm';

const SAME_USER = true;

type CommentBaseProps = {
  shortsId: string;
  commentId: string;
  nickname: string;
  avatarUrl: string;
  postedAt: string;
  comment: string;
  hasReply?: boolean;
  replyId?: string;
};

const CommentBase = ({
  shortsId,
  commentId,
  nickname,
  avatarUrl,
  postedAt,
  comment,
  hasReply,
  replyId,
}: CommentBaseProps) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const { refetch: resetComments } = useShortsComment(shortsId);

  const { mutate: deleteCommentMutate } = useDeleteShortsComment({
    shortsId,
    commentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      setOpenDeleteDialog(false);
    },
  });

  const { mutate: deleteReplyMutate } = useDeleteShortsCommentReply({
    shortsId,
    commentId,
    replyId: replyId || '',
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
    if (hasReply) {
      return deleteReplyMutate();
    }
    deleteCommentMutate();
  };

  return (
    <li className={'flex flex-col py-2 ' + (hasReply ? 'pl-12' : '')}>
      {isEditing ? (
        <CommentItemForm
          isEditing={isEditing}
          parentId={shortsId}
          commentContent={comment}
          handleCancelEditing={() => setIsEditing(false)}
          commentId={commentId}
          replyId={hasReply ? replyId : ''}
          hasReply={hasReply}
        />
      ) : (
        <div className="flex flex-row items-start gap-2">
          <Avatar className={hasReply ? 'h-6 w-6' : 'h-10 w-10'}>
            <AvatarImage src={avatarUrl} alt={nickname} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col items-start gap-1">
            <div className="flex w-full flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold leading-5">{nickname}</p>
                  <p
                    className="text-xs text-stone-500"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {postedAt}
                  </p>
                </div>
                <p className="whitespace-pre-wrap leading-5">{comment}</p>
              </div>
              {SAME_USER ? (
                <CommentButton
                  onClickEdit={handleClickEdit}
                  onClickDelete={handleOpenDeleteDialog}
                />
              ) : (
                <ReportButton />
              )}
            </div>
            {!hasReply && (
              <Button
                variant="ghost"
                onClick={() => setOpenCommentForm(!openCommentForm)}
                className="h-8 w-fit px-2 py-0 text-sm"
              >
                답글
              </Button>
            )}
            {openCommentForm && (
              <CommentItemForm
                parentId={shortsId}
                commentId={commentId}
                replyId={hasReply ? replyId : ''}
                handleCancelEditing={handleCancelEditing}
              />
            )}
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

export default CommentBase;
