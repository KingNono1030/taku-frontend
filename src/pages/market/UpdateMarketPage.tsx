import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORY_MAP } from '@/constants/jangter';
import { useProductDetails, useUpdateteProduct } from '@/queries/jangter';
import type { FindProductDetailSuccessResponse } from '@/types/api/jangter.types';

const updateProductSchema = z.object({
  categoryId: z.string().transform((val) => {
    const numberValue = parseFloat(val);
    if (isNaN(numberValue)) {
      throw new Error('가격은 숫자로 입력해주세요.');
    }
    return numberValue;
  }),
  title: z.string().nonempty('제목을 입력해주세요.'),
  description: z.string().nonempty('상품 정보를 입력해주세요.'),
  price: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const numberValue = Number(val);
        return isNaN(numberValue) ? undefined : numberValue;
      }
      return val;
    },
    z.number().refine((val) => val > 0, {
      message: '가격은 0보다 커야 합니다.',
    }),
  ),
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
type ProductDetail = Exclude<
  FindProductDetailSuccessResponse['data'],
  undefined
>;
interface ProductDetailResponse extends FindProductDetailSuccessResponse {
  data: ProductDetail;
}
const UpdateMarketPage = () => {
  const { id } = useParams();
  const productId = Number(id);

  const { mutate } = useUpdateteProduct(productId);

  const { data, isLoading, error } = useProductDetails(productId!);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>오류가 발생했습니다...</div>;

  const { data: productDetailData } = data as ProductDetailResponse;

  const { title, description, price, imageUrlList, itemCategoryId } =
    productDetailData;

  const form = useForm<z.infer<typeof updateProductSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      title,
      price,
      description,
      imageList: undefined,
      deleteImageUrl: [],
    },
  });
  const { setValue, watch, handleSubmit } = form;
  const values = watch();

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

  const onSubmit = (data: z.infer<typeof updateProductSchema>) => {
    mutate(data);
  };

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <Form {...form}>
        <form
          id="updateProductForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
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
            name="description"
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
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#767676]">
                  상품 카테고리
                </FormLabel>
                <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(itemCategoryId)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.keys(CATEGORY_MAP).map(
                          (categoryKey: string) => (
                            <SelectItem key={categoryKey} value={categoryKey}>
                              {CATEGORY_MAP[Number(categoryKey)]}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#767676]">
                  상품 가격
                </FormLabel>
                <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="상품 가격"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6">
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
              imageUrlList={imageUrlList}
            />
          </div>
          <Button type="submit" className="float-right">
            수정하기
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateMarketPage;
