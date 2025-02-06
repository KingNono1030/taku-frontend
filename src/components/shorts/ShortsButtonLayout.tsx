import React from 'react';

import { AxiosResponse } from 'axios';
import { MessageSquareText, ThumbsDown, ThumbsUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { testAxios } from '@/lib/axiosInstance';

import ShortsUploadDialog from './ShortsUploadDialog';

const addShortsLike = async (shortsId: string): Promise<AxiosResponse> => {
  return await testAxios.post('/api/shorts/' + shortsId + '/likes');
};

const cancelShortsLike = async (shortsId: string): Promise<AxiosResponse> => {
  return await testAxios.post('/api/shorts/' + shortsId + '/likes/cancel');
};

const addShortsDislike = async (shortsId: string): Promise<AxiosResponse> => {
  return await testAxios.post('/api/shorts/' + shortsId + '/dislikes');
};

const cancelShortsDislike = async (
  shortsId: string,
): Promise<AxiosResponse> => {
  return await testAxios.post('/api/shorts/' + shortsId + '/dislikes/cancel');
};

type Popularity = {
  commentsCount: number;
  dislikes: number;
  likes: number;
  views: number;
};

type UserLikeInteraction = {
  userDislike: boolean;
  userLike: boolean;
};

type SelectedVideoInfo = {
  description: string;
  m3u8_url: string;
  popularity_matic: Popularity;
  profile_img_url: string;
  shorts_id: string;
  user_like_interaction: UserLikeInteraction;
};

type ShortsButtonLayoutProps = {
  selectedVideoInfo: SelectedVideoInfo;
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>;
  resetVideoInfo: () => void;
};

const ShortsButtonLayout = ({
  selectedVideoInfo,
  setOpenComments,
  resetVideoInfo,
}: ShortsButtonLayoutProps) => {
  const handleClickThumbsUp = async () => {
    if (selectedVideoInfo.user_like_interaction?.userLike) {
      await cancelShortsLike(selectedVideoInfo.shorts_id).then(() => {
        resetVideoInfo && resetVideoInfo();
      });
    } else {
      await addShortsLike(selectedVideoInfo.shorts_id).then(() => {
        resetVideoInfo && resetVideoInfo();
      });
    }
  };

  const handleClickThumbsDown = async () => {
    if (selectedVideoInfo.user_like_interaction?.userDislike) {
      await cancelShortsDislike(selectedVideoInfo.shorts_id).then(() => {
        resetVideoInfo && resetVideoInfo();
      });
    } else {
      await addShortsDislike(selectedVideoInfo.shorts_id).then(() => {
        resetVideoInfo && resetVideoInfo();
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center text-sm">
      {/* 업로드 버튼 */}
      <div>
        <ShortsUploadDialog />
        <p>업로드</p>
      </div>
      {/* 좋아요 버튼 */}
      <div>
        <Button
          size="icon"
          variant={
            selectedVideoInfo?.user_like_interaction?.userLike
              ? 'default'
              : 'secondary'
          }
          className="h-12 w-12 rounded-full [&_svg]:size-5"
          onClick={handleClickThumbsUp}
        >
          <ThumbsUp />
        </Button>
        <p>{selectedVideoInfo?.popularity_matic?.likes}</p>
      </div>
      {/* 싫어요 버튼 */}
      <div>
        <Button
          size="icon"
          variant={
            selectedVideoInfo?.user_like_interaction?.userDislike
              ? 'default'
              : 'secondary'
          }
          className="h-12 w-12 rounded-full [&_svg]:size-5"
          onClick={handleClickThumbsDown}
        >
          <ThumbsDown />
        </Button>
        <p>싫어요</p>
      </div>
      <div>
        <Button
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full [&_svg]:size-5"
          onClick={() => setOpenComments((prevValue) => !prevValue)}
        >
          <MessageSquareText />
        </Button>
        <p>{selectedVideoInfo?.popularity_matic?.commentsCount}</p>
      </div>
    </div>
  );
};

export default ShortsButtonLayout;
