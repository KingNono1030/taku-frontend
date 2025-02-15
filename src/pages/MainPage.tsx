import { useRef } from 'react';

import Autoplay from 'embla-carousel-autoplay';

import Banner1 from '@/assets/banner/banner1.webp';
import Banner2 from '@/assets/banner/banner2.webp';
import Banner3 from '@/assets/banner/banner3.webp';
import Banner4 from '@/assets/banner/banner4.webp';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
  const plugin: any = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="flex flex-col gap-12">
      <Carousel
        plugins={[plugin?.current]}
        className="relative h-[740px] w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
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
        <h1 className="text-4xl font-bold">커뮤니티</h1>
      </section>
    </div>
  );
};

export default MainPage;
