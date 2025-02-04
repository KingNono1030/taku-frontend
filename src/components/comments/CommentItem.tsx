import { useState } from 'react';

import { AvatarImage } from '@radix-ui/react-avatar';

import { useDeleteShortsComment, useShortsComment } from '@/queries/shorts';

import ReportButton from '../report/ReportButton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import CommentButton from './CommentButton';
import CommentItemForm from './CommentItemForm';
import Replies from './Replies';

type CommentItemProps = {
  comment: any;
};

// TODO: test 용 상수 유저 auth로 추후 변경
export const SAME_USER = true;

const CommentItem = ({ comment }: CommentItemProps) => {
  const [openCommentForm, setOpenCommentForm] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const { refetch: resetComments } = useShortsComment(comment?.shorts_id);

  const { mutate: deleteCommentMutate } = useDeleteShortsComment({
    shortsId: comment?.shorts_id,
    commentId: comment?.id,
    onSuccessCb: () => {
      resetComments && resetComments();
    },
  });

  const handleClickEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setOpenCommentForm(false);
  };

  const handleDeleteComment = () => {
    deleteCommentMutate();
  };

  return (
    <li key={comment?.id} className="flex flex-col gap-2">
      {isEditing ? (
        <CommentItemForm
          commentId={comment?.id}
          parentId={comment?.shorts_id}
          handleCancelEditing={handleCancelEditing}
          commentContent={comment?.comment}
          isEditing={isEditing}
        />
      ) : (
        <div className="flex flex-row items-start gap-2">
          <Avatar>
            <AvatarImage
              src={comment?.user_info?.profile_image}
              alt={comment?.user_info?.nickname}
            />
            <AvatarFallback>{comment?.user_info?.nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col items-start gap-1">
            <div className="flex w-full flex-row items-start justify-between">
              <div>
                <p className="font-bold leading-5">
                  {comment?.user_info?.nickname}
                </p>
                <p className="whitespace-pre-wrap leading-5">
                  {comment?.comment}
                </p>
              </div>
              {SAME_USER ? (
                <CommentButton
                  onClickEdit={handleClickEdit}
                  onClickDelete={handleDeleteComment}
                />
              ) : (
                <ReportButton />
              )}
            </div>
            <Button
              variant="ghost"
              onClick={() => setOpenCommentForm(!openCommentForm)}
              className="h-8 w-fit px-2 py-0 text-sm"
            >
              답글
            </Button>
            {openCommentForm && (
              <CommentItemForm
                parentId={comment?.shorts_id}
                commentId={comment?.id}
                handleCancelEditing={handleCancelEditing}
              />
            )}
            <Replies replies={comment?.replies} />
          </div>
        </div>
      )}
    </li>
  );
};

export default CommentItem;
