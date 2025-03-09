import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
import {
  useCommunityGenres,
  useCreateCommunityCategory,
} from '@/queries/community';
import useUserStore from '@/store/userStore';

import { MultiSelect } from '../multi-select/MultiSelect';
import { Label } from '../ui/label';
import { Upload } from '../upload';

const addCategorySchema = z.object({
  category_name: z.string().nonempty('카테고리 이름을 입력해주세요.'),
  ani_genre_id: z.array(z.string().min(1)).nonempty('장르를 선택해주세요.'),
  image: z.any().refine((v) => !!v, { message: '이미지를 업로드해주세요.' }),
});

type Genre = {
  id: number;
  genreName: string;
};

const CategoryDialog = () => {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  // 장르 목록 조회
  const { data: genreList, isPending, error } = useCommunityGenres();

  // 카테고리 생성 훅
  const { mutate, isPending: createPending } = useCreateCommunityCategory({
    onSuccessCb: (data: any) => {
      form.reset();
      if (
        confirm(
          '카테고리가 생성되었습니다. 해당 카테고리로 이동하시겠습니까까?',
        )
      ) {
        const { data: resData } = data;
        navigate(`/community/${resData?.id}`);
      } else {
        setOpen(false);
      }
    },
  });

  //

  const [open, setOpen] = useState(false);

  const aniGenreArr = genreList?.data?.genres?.map((genre: Genre) => ({
    label: genre.genreName,
    value: genre.id.toString(),
  }));

  const form = useForm<z.infer<typeof addCategorySchema>>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      category_name: '',
      ani_genre_id: [],
      image: null,
    },
  });

  const onSubmit = (data: z.infer<typeof addCategorySchema>) => {
    console.log('data:', data);

    mutate(data);
  };

  const { setValue } = form;

  const handleDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => form.reset()} disabled={!user}>
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
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">카테고리 이름</FormLabel>
                  <FormControl className="md:text-base">
                    <Input placeholder="카테고리 이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ani_genre_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">장르</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={aniGenreArr ?? []}
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
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <Label className="text-base">
                    이미지 파일 업로드
                    <span className="text-sm text-gray-500" aria-hidden="true">
                      -[최대 20MB]
                    </span>
                  </Label>
                  <Upload
                    maxSize={
                      // 20MB
                      20 * 1024 * 1024
                    }
                    accept={{ 'image/*': [] }}
                    error={!!error}
                    file={field.value}
                    {...field}
                    onDrop={handleDropSingleFile}
                    onDelete={() =>
                      setValue('image', null, { shouldValidate: true })
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
            <DialogFooter>
              <Button type="submit" disabled={createPending}>
                {createPending && (
                  <Loader2 className="animate-spin" size={24} />
                )}
                저장하기
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
