import { useEffect, useRef, useState } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { Eye, Heart, ImageOff, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Banner1 from '@/assets/banner/banner1.webp';
import Banner2 from '@/assets/banner/banner2.webp';
import Banner3 from '@/assets/banner/banner3.webp';
import Banner4 from '@/assets/banner/banner4.webp';
import FallbackImage from '@/components/avatar/FallbackImage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { usePopularCommunityPosts } from '@/queries/community';
import { useProductItems } from '@/queries/jangter';

import { PopularCategories } from './community/CommunityPage';
import { ItemCard, ProductItem } from './market/tabs/MarketListPage';

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

const periodTypes = [
  {
    id: 'TODAY',
    label: '오늘',
  },
  {
    id: 'WEEK',
    label: '이번주',
  },
  {
    id: 'MONTH',
    label: '이번달',
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const [selectedPopularType, setSelectedPopularType] = useState(
    periodTypes[2].id,
  );

  const plugin: any = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true }),
  );

  const { data, refetch } = usePopularCommunityPosts({
    periodType: selectedPopularType,
  });

  const { data: itemList } = useProductItems({
    size: 4,
    sort: 'day',
    order: 'desc',
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: undefined,
    searchKeyword: undefined,
  });

  const allItems = (itemList?.pages.flatMap((page) => page.data) ??
    []) as ProductItem[];

  const handleMoveToCommunity = () => {
    navigate('/community');
  };

  const handleMoveToMarket = () => {
    navigate('/market');
  };

  useEffect(() => {
    refetch();
  }, [selectedPopularType]);

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
                  <FallbackImage
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
            className="font-bold text-muted-foreground"
            onClick={handleMoveToCommunity}
          >
            <Plus strokeWidth={3} />
            더보기
          </Button>
        </div>
        <div>
          <PopularCategories />
        </div>
      </section>
      <section>
        <div className="mb-10 flex items-center justify-between align-bottom">
          <h1 className="text-4xl font-bold">인기 게시글 TOP 10</h1>
          <div className="flex">
            {periodTypes?.map((type) => (
              <Button
                key={type.id}
                variant="ghost"
                className={`w-fit font-bold text-muted-foreground ${
                  selectedPopularType === type.id
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setSelectedPopularType(type.id)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {data?.data?.popularPosts?.map((post: any) => (
            <Card
              key={post.id}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl p-4 font-bold"
              onClick={() =>
                navigate(`/community/${post.categoryId}/${post.id}`)
              }
            >
              <div className="flex flex-col items-start gap-2">
                <h3 className="text-sm text-muted-foreground">
                  {post?.categoryName}
                </h3>
                <h2 className="text-lg font-bold">{post.title}</h2>
                <div className="flex gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Eye color="#1A7CFF" size={18} />
                    <p>{post?.views ?? 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart
                      size={18}
                      color="
                      #d32f2f
                      "
                    />
                    <p>{post?.likes ?? 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post?.userImageUrl} alt="profile" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <p>{post?.userNickname}</p>
                </div>
              </div>
              <div className="flex h-[120px] w-40 items-center justify-center overflow-hidden rounded-xl bg-gray-200">
                {post?.imageUrl ? (
                  <FallbackImage
                    src={post?.imageUrl}
                    alt="thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center [&_svg]:size-10">
                    <ImageOff color="#b1b1b1" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-10 flex items-center justify-between align-bottom">
          <h1 className="text-4xl font-bold">덕후장터</h1>
          <Button
            variant="ghost"
            className="font-bold text-muted-foreground"
            onClick={handleMoveToMarket}
          >
            <Plus strokeWidth={3} />
            더보기
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {allItems.length > 0 &&
            allItems?.map((item: ProductItem, index: number) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                itemsLength={allItems.length}
                lastItemRef={null}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
