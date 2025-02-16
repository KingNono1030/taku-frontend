import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { RHFUpload } from '@/components/hook-form/RhfUpload';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionLayout from '@/layout/SectionLayout';
import {
  useCommunityDetail,
  useUpdateCommunityDetail,
} from '@/queries/community';
import { FindPostDetailSuccessResponse } from '@/types/api/community.types';

const updatePostSchema = z.object({
  categoryId: z.string(),
  title: z.string().nonempty('제목을 입력해주세요.'),
  content: z.string().nonempty('상품 정보를 입력해주세요.'),
  imageList: z
    .array(
      z.object({
        preview: z.string(),
        name: z.string(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .max(5, '이미지는 최대 5개 까지 업로드 가능합니다.')
    .optional()
    .transform((imageObjects) => {
      if (!imageObjects) return undefined;
      return imageObjects.map((imageObj) => {
        const file = new File([], imageObj.name, {
          type: imageObj.type,
          lastModified: Date.now(),
        });
        return Object.assign(file, { preview: imageObj.preview });
      });
    }),
  deleteImageUrl: z.array(z.string()),
});
type PostDetail = Exclude<FindPostDetailSuccessResponse['data'], undefined>;
interface PostDetailResponse extends FindPostDetailSuccessResponse {
  data: PostDetail;
}
const UpdateCommunityPage = () => {
  const { category, id } = useParams();

  const navigate = useNavigate();

  const { mutate, isPending } = useUpdateCommunityDetail({
    postId: id ?? '',
    onSuccessCb: () => {
      navigate(`/community/${category}/${id}`);
    },
  });

  const { data, isLoading, error } = useCommunityDetail(id ?? '');

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>오류가 발생했습니다...</div>;

  const { data: postDetailData } = data as PostDetailResponse;

  const { title, content, imageUrls } = postDetailData;

  const form = useForm<z.infer<typeof updatePostSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      categoryId: category,
      title,
      content,
      imageList: undefined,
      deleteImageUrl: [],
    },
  });
  const { setValue, watch, handleSubmit } = form;
  const values = watch();

  const handleMoveBack = () => {
    navigate(`/community/${category}/${id}`);
  };

  const handleDropMultiFile = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.imageList || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setValue('imageList', [...files, ...newFiles], {
        shouldValidate: true,
      });
    },
    [setValue, values.imageList],
  );

  const onSubmit = (data: z.infer<typeof updatePostSchema>) => {
    mutate(data);
  };

  return (
    <SectionLayout>
      <h1 className="mt-10 text-center text-3xl font-bold">커뮤니티 수정</h1>

      <Form {...form}>
        <form
          id="updateProductForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="mt-10 flex flex-col gap-4 rounded-lg bg-slate-100 p-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#767676]">
                    상품 제목
                  </FormLabel>
                  <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                    <Input placeholder="상품 제목을 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-[#767676]">
                    상품 정보
                  </FormLabel>
                  <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                    <Textarea
                      className="h-40"
                      placeholder="상품 정보를 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RHFUpload
              multiple
              thumbnail
              name="imageList"
              maxSize={3145728}
              onDrop={handleDropMultiFile}
              onRemove={(inputFile) =>
                setValue(
                  'imageList',
                  values.imageList &&
                    values.imageList?.filter((file) => file !== inputFile),
                  { shouldValidate: true },
                )
              }
              onRemoveAll={() =>
                setValue('imageList', [], { shouldValidate: true })
              }
              deleteImageListName={'deleteImageUrl'}
              imageUrlList={imageUrls}
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={'secondary'}
              type="button"
              className="font-bold"
              onClick={handleMoveBack}
            >
              돌아가기
            </Button>
            <Button type="submit" className="font-bold" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              수정하기
            </Button>
          </div>
        </form>
      </Form>
    </SectionLayout>
  );
};

export default UpdateCommunityPage;
