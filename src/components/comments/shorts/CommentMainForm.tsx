import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
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
import { useCreateShortsComment } from '@/queries/shorts';
import useUserStore from '@/store/userStore';

const addCommentSchema = z.object({
  comment: z.string().nonempty('댓글을 입력해주세요.'),
});

type CommentMainFormProps = {
  parentId: string;
  resetComments?: () => void;
};

const CommentMainForm = ({ parentId, resetComments }: CommentMainFormProps) => {
  const { mutate: createCommentMutate } = useCreateShortsComment({
    shortsId: parentId,
    onSuccessCb: () => {
      resetComments && resetComments();
      form.reset();
    },
  });

  const [isFocused, setIsFocused] = useState(false);

  const user = useUserStore((state) => state.user);

  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsFocused(false);
  };

  const onSubmit = (data: z.infer<typeof addCommentSchema>) => {
    if (!parentId) {
      return;
    }
    createCommentMutate(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full gap-2"
      >
        <Avatar>
          <AvatarImage src={user?.profileImg} alt="@shadcn" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col items-end gap-2 bg-transparent">
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder={
                      user ? '댓글 추가...' : '로그인 후 이용해주세요.'
                    }
                    className={'min-h-10 border-stone-700 bg-transparent'}
                    rows={
                      form.watch('comment').split('\n').length > 2
                        ? 3
                        : form.watch('comment').split('\n').length
                    }
                    {...field}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    disabled={!user}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isFocused && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                type="button"
                className="h-8 py-1"
                onClick={handleCancel}
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
          )}
        </div>
      </form>
    </Form>
  );
};

export default CommentMainForm;
