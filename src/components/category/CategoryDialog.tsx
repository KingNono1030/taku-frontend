import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { RHFUpload } from '../hook-form/RhfUpload';
import { MultiSelect } from '../multi-select/MultiSelect';

const addCategorySchema = z.object({
  title: z.string().nonempty('제목을 입력해주세요.'),
  aniGenre: z.array(z.string().min(1)).nonempty('장르를 선택해주세요.'),
  multiUpload: z.array(
    z.object({
      preview: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    }),
  ),
});

const aniGenreArr = [
  { label: '액션', value: '1' },
  { label: '로맨스', value: '2' },
  { label: '스릴러', value: '3' },
  { label: '판타지', value: '4' },
  { label: '드라마', value: '5' },
  { label: '코미디', value: '6' },
  { label: 'SF', value: '7' },
  { label: '공포', value: '8' },
  { label: '모험', value: '9' },
  { label: '미스터리', value: '10' },
  { label: '범죄', value: '11' },
  { label: '전쟁', value: '12' },
  { label: '애니메이션', value: '13' },
  { label: '판타지', value: '14' },
  { label: '로맨틱코미디', value: '15' },
  { label: '스포츠', value: '16' },
  { label: '시대극', value: '17' },
  { label: '음악', value: '18' },
  { label: '가족', value: '19' },
  { label: '미니시리즈', value: '20' },
];

const CategoryDialog = () => {
  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      title: '',
      aniGenre: [],
      multiUpload: [],
    },
  });

  const onSubmit = (data: z.infer<typeof addCategorySchema>) => {
    console.log('123', data);
  };

  const { setValue, watch } = form;
  const values = watch();

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.multiUpload || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setValue('multiUpload', [...files, ...newFiles], {
        shouldValidate: true,
      });
    },
    [setValue, values.multiUpload],
  );
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => form.reset()}>
          카테고리 만들기
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
              name="aniGenre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">장르</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={aniGenreArr}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="선택하기..."
                      variant="inverted"
                      maxCount={20}
                    />
                  </FormControl>
                  <FormDescription>
                    애니메이션 장르를 선택하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RHFUpload
              multiple
              thumbnail
              name="multiUpload"
              maxSize={3145728}
              onDrop={handleDropMultiFile}
              onRemove={(inputFile) =>
                setValue(
                  'multiUpload',
                  values.multiUpload &&
                    values.multiUpload?.filter((file) => file !== inputFile),
                  { shouldValidate: true },
                )
              }
              onRemoveAll={() =>
                setValue('multiUpload', [], { shouldValidate: true })
              }
            />
            <DialogFooter>
              <Button type="submit">저장하기</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
