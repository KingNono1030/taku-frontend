import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileVideo, Loader2, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUploadShorts } from '@/queries/shorts';

import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Upload } from '../upload';

const uploadShortsSchema = z.object({
  title: z.string().nonempty('제목을 입력해주세요.'),
  description: z.string().nonempty('설명을 입력해주세요.'),
  file: z.any().refine((v) => !!v, { message: '파일을 업로드해주세요.' }),
  tags: z.array(z.string()),
});

const ShortsUploadDialog = () => {
  const onSuccessCb = () => {
    setOpen(false);
  };

  const { mutate: uploadShortsMutate, isPending } = useUploadShorts({
    onSuccessCb,
  });

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof uploadShortsSchema>>({
    resolver: zodResolver(uploadShortsSchema),
    defaultValues: {
      title: '',
      description: '',
      file: null,
      tags: [],
    },
  });
  const [inputValue, setInputValue] = useState('');

  const onSubmit = (data: z.infer<typeof uploadShortsSchema>) => {
    uploadShortsMutate(data);
  };

  const { setValue, watch } = form;
  const values = watch();

  const addHashtag = () => {
    if (inputValue === '') return;
    setValue('tags', [...values.tags, inputValue], { shouldValidate: true });
    setInputValue(''); // 초기화
  };

  const removeHashtag = (tag: string) => {
    setValue(
      'tags',
      values.tags.filter((t) => t !== tag),
      { shouldValidate: true },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('file', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant={'secondary'}
          className="h-12 w-12 rounded-full [&_svg]:size-5"
          onClick={() => {
            form.reset();
          }}
        >
          <FileVideo />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <form
            id="loginForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <DialogHeader>
              <DialogTitle>카테고리 만들기</DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">제목</FormLabel>
                  <FormControl className="md:text-base">
                    <Input placeholder="제목" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">설명</FormLabel>
                  <FormControl className="md:text-base">
                    <Input placeholder="한 줄 설명..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="file"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Label className="text-base">
                    비디오 파일 업로드
                    <span className="text-sm text-gray-500" aria-hidden="true">
                      -[최대 150MB]
                    </span>
                  </Label>
                  <Upload
                    maxSize={
                      // 150MB
                      150 * 1024 * 1024
                    }
                    accept={{ 'video/*': [] }}
                    error={!!error}
                    file={field.value}
                    {...field}
                    onDrop={handleDropSingleFile}
                    onDelete={() =>
                      setValue('file', null, { shouldValidate: true })
                    }
                  />
                  {!!error && (
                    <FormMessage className="text-center">
                      {error.message}
                    </FormMessage>
                  )}
                </div>
              )}
            />

            <div className="space-y-2">
              <h2>태그</h2>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="#해시태그 입력"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant={'secondary'}
                  onClick={addHashtag}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {values.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="animate-fade-in px-2 py-1 text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" size={24} />}
                {isPending ? '업로드 중...' : '업로드'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShortsUploadDialog;
