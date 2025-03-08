import { RankProductCard } from '@/components/market/RankProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useJangterRank } from '@/queries/jangter';
import { JangterRank, JangterRankType } from '@/types/api/jangter.types';

const MarketRankingPage = () => {
  const { data: jangterRankData, isLoading, isError } = useJangterRank();

  if (isLoading) return <div>로딩중...</div>;

  if (isError) return <div>에러가 발생했습니다.</div>;

  const { data } = jangterRankData as {
    data: { rank_info: Record<JangterRankType, JangterRank[]> };
  };
  const rankInfo = { ...data.rank_info } as Record<
    JangterRankType,
    JangterRank[]
  >;
  console.dir(rankInfo);
  return (
    <div>
      <section className="mb-10">
        <h4 className="mb-8 text-2xl font-bold">일간 랭킹</h4>
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {rankInfo.DAY.map((dayRank) => (
              <CarouselItem
                key={dayRank.product_id}
                className="relative aspect-square w-full basis-1/2 md:basis-1/3 xl:basis-1/4"
              >
                <RankProductCard data={dayRank} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={'default'} className="disabled:hidden" />
          <CarouselNext variant={'default'} className="disabled:hidden" />
          <CarouselDots />
        </Carousel>
      </section>
      <section className="mb-10">
        <h4 className="mb-8 text-2xl font-bold">주간 랭킹</h4>
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {rankInfo.WEEK.map((weekRank) => (
              <CarouselItem
                key={weekRank.product_id}
                className="relative aspect-square w-full basis-1/2 md:basis-1/3 xl:basis-1/4"
              >
                <RankProductCard data={weekRank} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={'default'} className="disabled:hidden" />
          <CarouselNext variant={'default'} className="disabled:hidden" />
          <CarouselDots />
        </Carousel>
      </section>
      <section className="mb-10">
        <h4 className="mb-8 text-2xl font-bold">월간 랭킹</h4>
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {rankInfo.MONTH.map((monthRank) => (
              <CarouselItem
                key={monthRank.product_id}
                className="relative aspect-square w-full basis-1/2 md:basis-1/3 xl:basis-1/4"
              >
                <RankProductCard data={monthRank} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={'default'} className="disabled:hidden" />
          <CarouselNext variant={'default'} className="disabled:hidden" />
          <CarouselDots />
        </Carousel>
      </section>
    </div>
  );
};
export default MarketRankingPage;
