import { useState } from 'react';

import {
  Bookmark,
  EllipsisVertical,
  Heart,
  Loader,
  LucideShare,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

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
import { Separator } from '@/components/ui/separator';
import { CATEGORY_MAP } from '@/constants/jangter';
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
} from '@/queries/jangter';
import type {
  FindProductDetailSuccessResponse,
  RecommendedProduct,
  findRecommendedProductSuccessResponse,
} from '@/types/api/jangter.types';

type ProductDetail = Exclude<
  FindProductDetailSuccessResponse['data'],
  undefined
>;
interface ProductDetailResponse extends FindProductDetailSuccessResponse {
  data: ProductDetail;
}

const MarketDetailPage = () => {
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
  const { mutate } = useDeleteProduct(productId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isProductDetailsLoading) return <ProductDetailSkeleton />;

  if (productDetailsError) return <div>오류가 발생했습니다...</div>;

  const { data: productDetailData } =
    productDetailResponse as ProductDetailResponse;

  const {
    title,
    description,
    price,
    createdAt,
    viewCount,
    imageUrlList,
    itemCategoryId,
    userId,
  } = productDetailData;
  const handleChat = () => {
    console.log(id);
  };
  const handleLike = () => {
    console.log('하트');
  };
  const isOwnPost = !((userId as number) % 2);

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
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={imageUrl}
                        alt={`${index}번째 상품 이미지`}
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
                등록된 상품 이미지가 없습니다...
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{title}</h1>
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
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link to={`/market/${productId}/edit`}>
                          <Pencil />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDialogOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <Trash2 />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant={'ghost'}
                  onClick={handleLike}
                  className="h-10 w-10 rounded-full"
                >
                  <Bookmark fill="#facc15" className="text-yellow-400" />
                </Button>
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
              <Heart fill="#ef4444" className="text-red-500" />
            </Button>
            <Button onClick={handleChat} className="w-full">
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
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              onClick={() => mutate()}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MarketDetailPage;
alert;
