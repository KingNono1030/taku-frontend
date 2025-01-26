import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const ProductDetailSkeleton = () => (
  <div className="mx-auto w-full max-w-[1240px]">
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <section>
        <div className="h-auto w-full">
          <Skeleton className="aspect-square h-full w-full" />
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-[50%]" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
          <Skeleton className="h-6 w-[20%]" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-[70%]" />
          </div>
          <h3 className="mt-2 text-2xl font-bold">
            <Skeleton className="h-8 w-[40%]" />
          </h3>
        </div>
        <div>
          <span className="flex items-center text-sm text-[#B0B3BA]">
            <Skeleton className="h-5 w-[50%]" />
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </section>
    </div>
    <Separator className="my-16" />
    <section>
      <h4 className="mb-8 text-2xl font-bold">상품 정보</h4>
      <div>
        <Skeleton className="h-7 w-full" />
        <Skeleton className="mt-2 h-7 w-full" />
        <Skeleton className="mt-2 h-7 w-full" />
      </div>
    </section>
    <Separator className="my-16" />
  </div>
);
