import { useRef } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Banner1 from '@/assets/banner/banner1.webp';
import Banner2 from '@/assets/banner/banner2.webp';
import Banner3 from '@/assets/banner/banner3.webp';
import Banner4 from '@/assets/banner/banner4.webp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { PopularCategories } from './community/CommunityPage';

const banners = [
  {
    id: 1,
    src: Banner1,
    alt: 'banner1',
  },
  {
    id: 2,
    src: Banner2,
    alt: 'banner2',
  },
  {
    id: 3,
    src: Banner3,
    alt: 'banner3',
  },
  {
    id: 4,
    src: Banner4,
    alt: 'banner4',
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const plugin: any = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true }),
  );

  const handleMoveToCommunity = () => {
    navigate('/community');
  };

  const handleMoveToMarket = () => {
    navigate('/market');
  };

  return (
    <div className="mb-10 flex flex-col gap-12">
      <Carousel
        plugins={[plugin?.current]}
        className="relative h-[740px] w-full"
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
          align: 'center',
        }}
      >
        <CarouselContent>
          {banners.map((_, index) => (
            <CarouselItem key={index}>
              <Card className="h-full w-full">
                <CardContent className="flex h-[740px] items-center justify-center p-0">
                  <img
                    src={banners[index].src}
                    alt={banners[index].alt}
                    className="h-full w-full object-cover object-bottom"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={'default'} />
        <CarouselNext variant={'default'} />
        <CarouselDots />
      </Carousel>

      <section>
        <div className="mb-10 flex items-center justify-between align-bottom">
          <h1 className="text-4xl font-bold">인기 커뮤니티</h1>
          <Button
            variant="ghost"
            className="font-bold"
            onClick={handleMoveToCommunity}
          >
            <Plus />
            더보기
          </Button>
        </div>
        <div>
          <PopularCategories />
        </div>
      </section>
      <section>
        <div className="mb-10 flex items-center justify-between align-bottom">
          <h1 className="text-4xl font-bold">덕후장터</h1>
          <Button
            variant="ghost"
            className="font-bold"
            onClick={handleMoveToMarket}
          >
            <Plus />
            더보기
          </Button>
        </div>
        <div className="h-[400px] w-full bg-gray-200">덕후장터 컨텐츠 영역</div>
      </section>
    </div>
  );
};

export default MainPage;
