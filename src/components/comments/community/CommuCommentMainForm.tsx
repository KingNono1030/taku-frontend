import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCommunityComment } from '@/queries/community';
import useUserStore from '@/store/userStore';

const addCommentSchema = z.object({
  postId: z.string(),
  content: z.string().nonempty('댓글을 입력해주세요.'),
  parentCommentId: z.string().optional(),
});

type CommuCommentMainFormProps = {
  parentId: string;
  resetComments?: () => void;
};

const CommuCommentMainForm = ({
  parentId,
  resetComments,
}: CommuCommentMainFormProps) => {
  const { mutate: createCommentMutate } = useCreateCommunityComment({
    onSuccessCb: () => {
      resetComments && resetComments();
      form.reset();
    },
  });

  const user = useUserStore((state) => state.user);

  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      postId: parentId,
      content: '',
      parentCommentId: undefined,
    },
  });

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
        <div className="relative my-10 w-full">
          <Button
            variant="ghost"
            className="absolute right-5 top-1/2 h-8 w-8 -translate-y-1/2 transform text-muted-foreground text-primary"
            disabled={!form.formState.isDirty}
          >
            등록
          </Button>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder={
                      user
                        ? `댓글을 입력해주세요...
Ctrl + Enter로 댓글을 등록할 수 있습니다.
                      `
                        : '로그인 후 이용해주세요.'
                    }
                    className={'resize-none bg-transparent'}
                    rows={3}
                    {...field}
                    onKeyDown={handleKeyDown}
                    disabled={!user}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default CommuCommentMainForm;
