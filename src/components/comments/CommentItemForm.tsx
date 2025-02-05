import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useCreateShortsCommentReply,
  useEditShortsComment,
  useEditShortsCommentReply,
  useShortsComment,
} from '@/queries/shorts';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

const addCommentSchema = z.object({
  comment: z.string().nonempty('댓글을 입력해주세요.'),
});

type CommentItemFormProps = {
  isEditing?: boolean;
  hasReply?: boolean;
  parentId: string;
  commentId: string;
  replyId?: string;
  commentContent?: string;
  resetComments?: (resCommentArr: any[]) => void; // eslint-disable-line
  handleCancelEditing?: () => void;
};

const CommentItemForm = ({
  isEditing,
  hasReply,
  parentId,
  commentId,
  replyId,
  commentContent,
  handleCancelEditing,
}: CommentItemFormProps) => {
  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      comment: '',
    },
  });

  //댓글 리스트 리프레시
  const { refetch: resetComments } = useShortsComment(parentId);

  //댓글 수정
  const { mutate: editCommentMutate } = useEditShortsComment({
    shortsId: parentId,
    commentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      handleCancelEditing && handleCancelEditing();
      form.reset();
    },
  });

  //대댓글 생성
  const { mutate: createReplyMutate } = useCreateShortsCommentReply({
    shortsId: parentId,
    commentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      handleCancelEditing && handleCancelEditing();
      form.reset();
    },
  });

  //대댓글 수정
  const { mutate: updateReplyMutate } = useEditShortsCommentReply({
    shortsId: parentId,
    commentId,
    replyId: replyId || '',
    onSuccessCb: () => {
      resetComments && resetComments();
      handleCancelEditing && handleCancelEditing();
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof addCommentSchema>) => {
    if (!parentId) {
      return;
    }

    if (isEditing) {
      if (hasReply) {
        // 대댓글 수정
        return updateReplyMutate(data);
      }
      // 댓글 수정
      return editCommentMutate(data);
    }

    // 답글 추가
    return createReplyMutate(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    if (isEditing && commentContent) {
      form.setValue('comment', commentContent);
    }
  }, [isEditing]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-2"
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col items-end gap-2 bg-transparent">
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="댓글 추가..."
                    className={'min-h-10 border-stone-700 bg-transparent'}
                    rows={
                      form.watch('comment').split('\n').length > 2
                        ? 3
                        : form.watch('comment').split('\n').length
                    }
                    {...field}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              type="button"
              className="h-8 py-1"
              onClick={handleCancelEditing}
            >
              취소
            </Button>
            <Button
              variant="secondary"
              type="submit"
              className="h-8 py-1"
              disabled={!form.formState.isDirty && !form.formState.isValid}
            >
              댓글
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentItemForm;
