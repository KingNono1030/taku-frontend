import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CornerDownRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  useCommunityDetail,
  useCreateCommunityComment,
  useUpdateCommunityComment,
} from '@/queries/community';
import useUserStore from '@/store/userStore';

const addCommentSchema = z.object({
  content: z.string().nonempty('댓글을 입력해주세요.'),
});

type CommuCommentItemFormProps = {
  isEditing?: boolean;
  parentId: string;
  commentId: string;
  commentContent?: string;
  resetComments?: (resCommentArr: any[]) => void; // eslint-disable-line
  handleCancelEditing?: () => void;
};

const CommuCommentItemForm = ({
  isEditing,
  parentId,
  commentId,
  commentContent,
  handleCancelEditing,
}: CommuCommentItemFormProps) => {
  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      content: '',
    },
  });

  //댓글 리스트 리프레시
  const { refetch: resetComments } = useCommunityDetail(parentId);

  const user = useUserStore((state) => state.user);

  //댓글 수정
  const { mutate: editCommentMutate } = useUpdateCommunityComment({
    commentsId: commentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      handleCancelEditing && handleCancelEditing();
      form.reset();
    },
  });

  //대댓글 생성
  const { mutate: createCommentMutate } = useCreateCommunityComment({
    onSuccessCb: () => {
      resetComments && resetComments();
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof addCommentSchema>) => {
    if (!parentId) {
      return;
    }

    if (isEditing) {
      // 댓글 수정
      const updateCommentData = {
        postId: parentId,
        ...data,
      };
      return editCommentMutate(updateCommentData);
    }
    // 대댓글 추가
    const createCommentData = {
      postId: parentId,
      parentCommentId: commentId,
      ...data,
    };
    return createCommentMutate(createCommentData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  useEffect(() => {
    if (isEditing && commentContent) {
      form.setValue('content', commentContent);
    }
  }, [isEditing]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-2 flex w-full gap-2"
      >
        <CornerDownRight className="mt-2" />
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-row items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.profileImg} alt="@shadcn" />
              <AvatarFallback>{user?.nickname}</AvatarFallback>
            </Avatar>
            <p className="font-bold">{user?.nickname}</p>
          </div>
          <div className="flex w-full flex-col items-end gap-2 bg-transparent">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="댓글 추가..."
                      className={'min-h-10 bg-transparent'}
                      rows={3}
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
                className="h-8 py-1 font-bold"
                onClick={handleCancelEditing}
              >
                취소
              </Button>
              <Button
                variant="default"
                type="submit"
                className="h-8 py-1 font-bold"
                disabled={!form.formState.isDirty && !form.formState.isValid}
              >
                댓글
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommuCommentItemForm;
