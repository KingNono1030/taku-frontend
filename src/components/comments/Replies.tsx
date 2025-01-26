import React from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import ReportButton from '../report/ReportButton';
import CommentButton from './CommentButton';
import { SAME_USER } from './CommentItem';

type RepliesProps = {
  replies: any[];
};

const Replies = ({ replies }: RepliesProps) => {
  const [replieOpen, setReplieOpen] = React.useState(false);

  return (
    <>
      {replies.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplieOpen((prevValue) => !prevValue)}
          className="text-primary hover:bg-primary"
        >
          {replieOpen ? <ChevronUp /> : <ChevronDown />}
          답글 {replies.length}개
        </Button>
      )}
      {replieOpen && (
        <ul className="flex w-full flex-col gap-2">
          {replies.map((reply) => (
            <li key={reply.id} className="flex w-full justify-between gap-2">
              <div className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={'https://github.com/shadcn.png'} />
                  <AvatarFallback>{reply.reply_text[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <p className="font-bold leading-5">익명</p>
                  <p className="leading-5">{reply.reply_text}</p>
                </div>
              </div>
              {SAME_USER ? <CommentButton /> : <ReportButton />}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Replies;
