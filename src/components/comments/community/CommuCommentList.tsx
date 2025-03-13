import { CornerDownRight } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

// import { formatKoreanDateWithLimit } from '@/lib/utils';

import CommuCommentBase from './CommuCommentBase';

type ReplyType = {
  id: string;
  user: {
    nickname: string;
    profileImg: string;
    gender?: string;
    ageRange?: string;
  };
  createdAt: string;
  content: string;
  isOwner: boolean;
};

type CommentType = {
  id: string;
  user: {
    nickname: string;
    profileImg: string;
    gender?: string;
    ageRange?: string;
  };
  createdAt: string;
  content: string;
  isOwner: boolean;
  replies: ReplyType[];
};

type CommentProps = {
  parentId: string;
  commentsArr: CommentType[];
};

const ReplyCommentBase = ({
  postId,
  replies,
}: {
  postId: string;
  replies: ReplyType[];
}) => {
  return (
    <div className="flex w-full gap-2 bg-slate-100 p-4">
      <CornerDownRight className="mt-4" />
      <div className="flex w-full flex-col">
        {replies.map((reply: ReplyType) => {
          const {
            id: replyId,
            user: { nickname: replyNickname, profileImg: replyAvatarUrl },
            createdAt: replyPostedAt,
            content: replyMessage,
            isOwner,
          } = reply;

          // const replyPostedAt = formatKoreanDateWithLimit(created_at);

          return (
            <CommuCommentBase
              key={replyId}
              postId={postId}
              commentId={replyId}
              nickname={replyNickname}
              avatarUrl={replyAvatarUrl}
              postedAt={replyPostedAt}
              comment={replyMessage}
              isOwner={isOwner}
              hasReply
            />
          );
        })}
      </div>
    </div>
  );
};

const CommuCommentList = ({ parentId, commentsArr }: CommentProps) => {
  return (
    <>
      {commentsArr.map((comment) => {
        const {
          id: commentId,
          user,
          createdAt,
          content: message,
          replies,
          isOwner,
        } = comment;

        // const postedAt = formatKoreanDateWithLimit(createdAt);

        const { nickname, profileImg: avatarUrl } = user;

        const hasReply = !!comment.replies.length;

        return (
          <ul className="flex flex-col" key={commentId}>
            <CommuCommentBase
              postId={parentId}
              commentId={commentId}
              nickname={nickname}
              avatarUrl={avatarUrl}
              postedAt={createdAt}
              comment={message}
              isOwner={isOwner}
            />
            {hasReply && <Separator />}
            {hasReply && (
              <ReplyCommentBase postId={parentId} replies={replies} />
            )}
          </ul>
        );
      })}
    </>
  );
};

export default CommuCommentList;
