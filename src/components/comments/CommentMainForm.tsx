import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { testAxios } from '@/lib/axiosInstance';

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

type CommentMainFormProps = {
  parentId?: string;
  resetComments?: (resCommentArr: any[]) => void; //eslint-disable-line
};

const CommentMainForm = ({ parentId, resetComments }: CommentMainFormProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      comment: '',
    },
  });

  const addComment = async (data: {
    comment: string;
  }): Promise<AxiosResponse> => {
    return await testAxios.post('/api/shorts/' + parentId + '/comment', data);
  };

  const handleCancel = () => {
    form.reset();
    setIsFocused(false);
  };

  const onSubmit = (data: z.infer<typeof addCommentSchema>) => {
    if (!parentId) {
      return;
    }

    addComment(data).then((res) => {
      resetComments && resetComments(res.data.data);
      form.reset();
      console.log(res);
    });
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
                    onFocus={() => setIsFocused(true)}
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
