import { User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CarouselItem } from '@/components/ui/carousel';

import VideoPlayer from '../video-player/VideoPlayer';

type userLikeInteraction = {
  userLike: boolean;
  userDislike: boolean;
};

type popularityMatic = {
  views: number;
  commentsCount: number;
  likes: number;
  dislikes: number;
};

type shortsDetailData = {
  shorts_id: string;
  m3u8_url: string;
  profile_img_url: string;
  description: string;
  user_like_interaction: userLikeInteraction;
  popularity_matic: popularityMatic;
};

type ShortsDetailCarouselItemProps = {
  title: string;
  shortsDetailData: shortsDetailData | undefined;
};

const ShortsDetailCarouselItem = ({
  title,
  shortsDetailData,
}: ShortsDetailCarouselItemProps) => {
  return (
    <CarouselItem className="w-full basis-11/12">
      <div className="aspect-16/9 relative h-full max-h-[calc(100vh-340px)] w-full overflow-hidden rounded-lg">
        <VideoPlayer
          src={shortsDetailData?.m3u8_url ?? ''}
          type="m3u8"
          shortsId={shortsDetailData?.shorts_id ?? ''}
        />
        <div className="absolute bottom-20 left-0 z-10 bg-[#00000000] px-4 py-1 text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
          <div>
            <Avatar className="h-6 w-6">
              <AvatarImage src={shortsDetailData?.profile_img_url} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </div>
          <p>{title}</p>
          <p>{shortsDetailData?.description}</p>
        </div>
      </div>
    </CarouselItem>
  );
};

export default ShortsDetailCarouselItem;
