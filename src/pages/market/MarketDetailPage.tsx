import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  Bookmark,
  Check,
  EllipsisVertical,
  ImageOff,
  Loader,
  LucideShare,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';

import FallbackImage from '@/components/avatar/FallbackImage';
import { ProductDetailSkeleton } from '@/components/loading/jangter/ProductDetailSkeleton';
import { RecommendProductCard } from '@/components/market/RecommendProductCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_MAP, STATUS_MAP } from '@/constants/jangter';
import { useChat } from '@/hooks/chat/useChat';
import {
  cn,
  formatCurrency,
  formatKoreanDate,
  formatLargeNumber,
  shareCurrentURL,
} from '@/lib/utils';
import {
  useDeleteProduct,
  useProductDetails,
  useRecommendedProducts,
  useUpdateteProductStatus,
} from '@/queries/jangter';
import { addJangterBookmarks } from '@/services/jangter';
import useUserStore from '@/store/userStore';
import type {
  ProductStatus,
  RecommendedProduct,
  UpdateProductStatusRequest,
  findRecommendedProductSuccessResponse,
} from '@/types/api/jangter.types';

const MarketDetailPage = () => {
  const [isBookmarkSent, setIsBookmarSent] = useState(false);
  const { id } = useParams();
  const productId = Number(id);
  const {
    data: productDetailResponse,
    isLoading: isProductDetailsLoading,
    error: productDetailsError,
  } = useProductDetails(productId);
  const {
    data: recommendedProductResponse,
    isLoading: isRecommendedProductsLoading,
    error: recommendedProductsError,
  } = useRecommendedProducts(productId);
  const { mutate: updateProductState } = useUpdateteProductStatus(productId);
  const { mutate: deleteProduct } = useDeleteProduct(productId);
  const { handleChat } = useChat();
  const user = useUserStore((state) => state.user);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const productDetailData = productDetailResponse?.data ?? {
    title: '',
    description: '',
    price: 0,
    status: 'FOR_SALE',
    createdAt: '',
    viewCount: 0,
    itemCategoryId: 0,
    userId: 0,
    imageUrlList: [],
  };

  const {
    title,
    description,
    price,
    createdAt,
    viewCount,
    imageUrlList,
    itemCategoryId,
    userId: sellerId,
    status,
  } = productDetailData;

  const { register, handleSubmit, setValue, watch } =
    useForm<UpdateProductStatusRequest>({
      defaultValues: {
        status,
        soldPrice: undefined,
      },
    });

  const useAddBookmark = (productId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => {
        await addJangterBookmarks(productId);
      },
      onSuccess: (response) => {
        // 요청 성공 시 실행할 로직
        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'jangterBookmarks',
        });
        return response;
      },
      onError: (error: AxiosError) => {
        // 요청 실패 시 실행할 로직
        if (error?.response?.status == 409) {
          alert('이미 북마크한 게시글입니다.');
        }
      },
      onSettled: () => {
        // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
        setIsBookmarSent(true);
      },
    });
  };
  const { mutate: addJangterBookmarksMutate } = useAddBookmark(productId);

  const handleLike = async () => {
    await addJangterBookmarksMutate();
  };
  const isOwnPost = (sellerId as number) === user?.id;

  if (isProductDetailsLoading) return <ProductDetailSkeleton />;
  if (productDetailsError) return <div>오류가 발생했습니다...</div>;

  const getRecommendPostList = (
    isLoading: boolean,
    error: boolean,
    data?: findRecommendedProductSuccessResponse,
  ) => {
    if (isLoading) return <Loader />;
    if (error) return <div>에러가 발생했습니다.</div>;
    const recommendProducts = data?.data?.recommendProducts ?? [];

    return (
      <>
        {recommendProducts &&
          recommendProducts.map((product: RecommendedProduct) => (
            <RecommendProductCard data={product} key={product.product_id} />
          ))}
      </>
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <section>
          <div>
            {imageUrlList && !!imageUrlList.length && (
              <Carousel>
                <CarouselContent>
                  {imageUrlList.map((imageUrl, index) => (
                    <CarouselItem
                      key={imageUrl}
                      className="relative aspect-square w-full"
                    >
                      <FallbackImage
                        src={imageUrl}
                        alt={`${index}번째 상품 이미지`}
                        className="h-full w-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  variant={'default'}
                  className="disabled:hidden"
                />
                <CarouselNext variant={'default'} className="disabled:hidden" />
                <CarouselDots />
              </Carousel>
            )}
            {(imageUrlList && !!imageUrlList.length) || (
              <div className="flex aspect-square w-full items-center justify-center bg-gray-200">
                <ImageOff size={64} color="#b1b1b1" />
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <Badge variant={'secondary'} className="hover:bg-accent">
                  {STATUS_MAP[status as ProductStatus]}
                </Badge>
              </div>
              <div className="flex gap-2">
                {isOwnPost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'h-10 w-10 rounded-full',
                        )}
                      >
                        <EllipsisVertical />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsUpdateDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Check />
                        판매 현황
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link to={`/market/${productId}/edit`}>
                          <Pencil />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash2 />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <h2 className="text-gray-400">
              {formatKoreanDate(createdAt as string)}
            </h2>
            <div className="flex gap-2">
              <Badge variant={'outline'} className="hover:bg-accent">
                {CATEGORY_MAP[itemCategoryId as number] || '기타'}
              </Badge>
            </div>
            <h3 className="mt-2 text-2xl font-bold">
              {formatCurrency(price as number)}
            </h3>
          </div>
          <div>
            <span className="flex items-center text-sm text-[#B0B3BA]">
              <Bookmark width={12} hanging={12} className="mr-1 inline" />
              {`북마크 ${formatLargeNumber(viewCount as number)}`}
              {' · '}
              {`조회 ${formatLargeNumber(viewCount as number)}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <Button
              variant={'ghost'}
              onClick={handleLike}
              className="h-10 w-10 rounded-full"
            >
              <Bookmark
                className={cn('text-yellow-400', {
                  'fill-primary': isBookmarkSent,
                })}
              />
            </Button>
            <Button
              onClick={() => handleChat(productId)}
              className="w-full"
              disabled={isOwnPost}
            >
              채팅하기
            </Button>
            <Button
              onClick={shareCurrentURL}
              variant={'outline'}
              className="w-full"
            >
              <LucideShare />
              공유하기
            </Button>
          </div>
        </section>
      </div>
      <Separator className="my-16" />
      <section>
        <h4 className="mb-8 text-2xl font-bold">상품 정보</h4>
        <div>
          <p className="text-lg">{description}</p>
        </div>
      </section>
      <Separator className="my-16" />
      <section>
        <h4 className="mb-8 text-2xl font-bold">추천 상품</h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {getRecommendPostList(
            isRecommendedProductsLoading,
            !!recommendedProductsError,
            recommendedProductResponse,
          )}
        </div>
      </section>
      {user && (
        <div className="group fixed bottom-10 right-10">
          <Link to={'/market/add'}>
            <Button
              asChild
              className="relative z-20 rounded-full shadow-lg shadow-slate-400 transition-transform duration-300 group-hover:translate-x-8"
              size={'icon'}
            >
              <Plus />
            </Button>
            <div className="absolute -right-2 bottom-1/2 z-10 w-[140px] translate-y-1/2 rounded bg-gray-100/50 px-3 py-2 font-semibold text-black opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              장터 게시글 추가
            </div>
          </Link>
        </div>
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              정말로 장터 게시글 삭제를 희망하십니까?
            </AlertDialogTitle>
            <AlertDialogDescription>
              한 번 삭제된 게시물은 복구될 수 없습니다.
              <br />
              그럼에도 삭제를 원하신다면, 아래 삭제 버튼을 눌러 진행해주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct()}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      >
        <AlertDialogContent>
          {status !== 'SOLD_OUT' ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  상품 판매 현황을 수정해주세요.
                </AlertDialogTitle>
                <AlertDialogDescription>
                  판매가 완료된 경우, 최종 판매 금액을 입력해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form
                id="statusUpdateForm"
                onSubmit={handleSubmit((data) => updateProductState(data))}
                className="space-y-6"
              >
                <div className="flex gap-2">
                  <Select
                    value={watch('status')}
                    onValueChange={(value: ProductStatus) => {
                      setValue('status', value);
                      if (value !== 'SOLD_OUT') {
                        setValue('soldPrice', undefined);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOR_SALE">판매중</SelectItem>
                      <SelectItem value="RESERVED">예약중</SelectItem>
                      <SelectItem value="SOLD_OUT">판매완료</SelectItem>
                    </SelectContent>
                  </Select>
                  {watch('status') === 'SOLD_OUT' && (
                    <Input
                      placeholder="판매금"
                      step={100}
                      type="number"
                      {...register('soldPrice')}
                    />
                  )}
                </div>
              </form>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>

                <AlertDialogAction
                  form="statusUpdateForm"
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  입력
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <AlertDialogHeader>
                이미 판매가 완료 처리된 경우, 판매 상태를 변경할 수 없습니다.
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MarketDetailPage;
