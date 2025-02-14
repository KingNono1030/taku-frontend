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
    Autoplay({ delay: 1000, stopOnInteraction: true }),
  );

  return (
    <div>
      <Carousel
        plugins={[plugin?.current]}
        className="relative h-[400px] w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((_, index) => (
            <CarouselItem key={index}>
              <Card className="h-full w-full">
                <CardContent className="flex h-[400px] items-center justify-center p-0">
                  <img
                    src={banners[index].src}
                    alt={banners[index].alt}
                    className="h-full w-full object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default MainPage;
