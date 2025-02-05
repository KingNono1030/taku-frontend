import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { formatKoreanDateWithLimit } from '@/lib/utils';

import { Button } from '../ui/button';
import CommentBase from './CommentBase';

type ReplyType = {
  id: string;
  user_id: string;
  nickname: string;
  profile_image: string;
  created_at: string;
  reply_text: string;
};

type CommentType = {
  shorts_id: string;
  id: string;
  user_info: {
    nickname: string;
    profile_image: string;
  };
  created_at: string;
  comment: string;
  replies: ReplyType[];
};

type CommentProps = {
  commentsArr: CommentType[];
};

const ReplyCommentBase = ({
  shorts_id,
  commentId,
  replies,
}: {
  shorts_id: string;
  commentId: string;
  replies: ReplyType[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((prevValue) => !prevValue)}
        className="ml-10 w-fit text-primary hover:bg-primary"
      >
        {open ? <ChevronUp /> : <ChevronDown />}
        답글 {replies?.length}개
      </Button>

      {open &&
        replies.map((reply) => {
          const {
            id: replyId,
            nickname: replyNickname,
            profile_image: replyAvatarUrl,
            created_at,
            reply_text: replyMessage,
          } = reply;

          const replyPostedAt = formatKoreanDateWithLimit(created_at);

          return (
            <CommentBase
              key={replyId}
              shortsId={shorts_id}
              commentId={commentId}
              nickname={replyNickname}
              avatarUrl={replyAvatarUrl}
              postedAt={replyPostedAt}
              comment={replyMessage}
              hasReply
              replyId={replyId}
            />
          );
        })}
    </>
  );
};

const CommentList = ({ commentsArr }: CommentProps) => {
  return (
    <>
      {commentsArr.map((comment) => {
        const {
          shorts_id,
          id: commentId,
          user_info,
          created_at,
          comment: message,
          replies,
        } = comment;

        const postedAt = formatKoreanDateWithLimit(created_at);

        const { nickname, profile_image: avatarUrl } = user_info;

        const hasReply = !!comment.replies.length;

        return (
          <ul className="flex flex-col" key={commentId}>
            <CommentBase
              shortsId={shorts_id}
              commentId={commentId}
              nickname={nickname}
              avatarUrl={avatarUrl}
              postedAt={postedAt}
              comment={message}
            />
            {hasReply && (
              <ReplyCommentBase
                shorts_id={shorts_id}
                commentId={commentId}
                replies={replies}
              />
            )}
          </ul>
        );
      })}
    </>
  );
};

export default CommentList;
