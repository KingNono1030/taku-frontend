import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { RHFUpload } from '@/components/hook-form/RhfUpload';
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
import { useCreateProduct } from '@/queries/jangter';

const addProductSchema = z.object({
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
    .array(z.instanceof(File))
    .max(5, '이미지는 최대 5개 까지 업로드 가능합니다.')
    .optional(),
});

const CreateMarketPage = () => {
  const { mutate } = useCreateProduct();

  const form = useForm<z.infer<typeof addProductSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: '',
      description: '',
      imageList: undefined,
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

  const onSubmit = (data: z.infer<typeof addProductSchema>) => {
    mutate(data);
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-[720px]">
      <Form {...form}>
        <form
          id="creaetProductForm"
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
                  <Select onValueChange={field.onChange}>
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
            />
          </div>
          <Button type="submit" className="float-right">
            작성하기
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateMarketPage;
