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

const mockJangterRanks: JangterRank[] = [
  {
    rank_idx: 1,
    product_id: 1001,
    product_name: '뉴진스 하니 포토카드 SET',
    product_image: 'https://picsum.photos/400/400',
    product_price: 35000,
    author_name: '하니러버',
  },
  {
    rank_idx: 2,
    product_id: 1002,
    product_name: '르세라핌 카즈하 굿즈 풀셋',
    product_image: 'https://picsum.photos/400/400',
    product_price: 89000,
    author_name: '카즈하팬',
  },
  {
    rank_idx: 3,
    product_id: 1003,
    product_name: 'BTS 지민 슬로건',
    product_image: 'https://picsum.photos/400/400',
    product_price: 15000,
    author_name: '지민러브',
  },
  {
    rank_idx: 4,
    product_id: 1004,
    product_name: '아이브 안유진 팬콘 티켓',
    product_image: 'https://picsum.photos/400/400',
    product_price: 150000,
    author_name: '유진이최고',
  },
  {
    rank_idx: 5,
    product_id: 1005,
    product_name: '블랙핑크 리사 포스터',
    product_image: 'https://picsum.photos/400/400',
    product_price: 12000,
    author_name: '리사팬닉',
  },
  {
    rank_idx: 6,
    product_id: 1006,
    product_name: '에스파 윈터 키링',
    product_image: 'https://picsum.photos/400/400',
    product_price: 25000,
    author_name: '윈터사랑해',
  },
  {
    rank_idx: 7,
    product_id: 1007,
    product_name: '투모로우바이투게더 앨범',
    product_image: 'https://picsum.photos/400/400',
    product_price: 45000,
    author_name: '모아사랑',
  },
  {
    rank_idx: 8,
    product_id: 1008,
    product_name: '아이브 우지원 응원봉',
    product_image: 'https://picsum.photos/400/400',
    product_price: 55000,
    author_name: '우지원러버',
  },
  {
    rank_idx: 9,
    product_id: 1009,
    product_name: '엔시티 재현 스티커',
    product_image: 'https://picsum.photos/400/400',
    product_price: 8000,
    author_name: '재현이최고',
  },
  {
    rank_idx: 10,
    product_id: 1010,
    product_name: '세븐틴 호시 팔찌',
    product_image: 'https://picsum.photos/400/400',
    product_price: 18000,
    author_name: '호시팬',
  },
];

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
            {mockJangterRanks.map((dayRank) => (
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
            {mockJangterRanks.map((dayRank) => (
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
        <h4 className="mb-8 text-2xl font-bold">월간 랭킹</h4>
        <Carousel className="w-full">
          <CarouselContent className="w-full">
            {mockJangterRanks.map((dayRank) => (
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
    </div>
  );
};
export default MarketRankingPage;
