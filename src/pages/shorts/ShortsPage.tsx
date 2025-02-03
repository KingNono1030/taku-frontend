import { useCallback, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ShortsButtonLayout from '@/components/shorts/ShortsButtonLayout';
import ShortsCommentsCard from '@/components/shorts/ShortsCommentsCard';
import ShortsDetailCarouselItem from '@/components/shorts/ShortsDetailCarouselItem';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { testAxios } from '@/lib/axiosInstance';
import { getShortsDetail } from '@/services/shorts';

const ShortsPage = () => {
  const [openComments, setOpenComments] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);

  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const logCurrentTime = () => {
    console.log('비디오 시간', currentTime);
    setCurrentTime(0);
  };

  // 쇼츠 리스트 가져오기
  const getVedioList = async (): Promise<AxiosResponse> => {
    return await testAxios.get('/api/shorts/recommend');
  };

  // 선택된 쇼츠의 상세 정보 가져오기
  const { data: shortsDetailData, refetch: refetchShortsDetailData } = useQuery(
    {
      queryKey: ['shortsDetail', selectedVideo?.id],
      queryFn: async () => await getShortsDetail(selectedVideo?.id),
    },
  );

  const loadMoreVideos = () => {
    getVedioList().then((res) => {
      // 랜덤 데이터 추가시 id 중복이 발생하여 제외하고 추가
      const newVideos = res.data.data.filter(
        (video: any) => !videos.some((v) => v.id === video.id),
      );
      setVideos([...videos, ...newVideos]);
    });
  };

  const observer: any = useRef();

  // 쇼츠 리스트의 마지막 요소를 관찰하여 추가 데이터를 가져옴
  const lastVideoElementRef = (node: any) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreVideos();
      }
    });
    if (node) observer.current.observe(node);
  };

  // 이전 쇼츠로 스크롤
  const scrollPrev = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  // 다음 쇼츠로 스크롤
  const scrollNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scrollNext, scrollPrev]);

  // 쇼츠 리스트 가져오기
  useEffect(() => {
    getVedioList().then((res) => {
      setVideos(res.data.data);
    });
  }, []);

  // 쇼츠 리스트가 변경되면 선택된 쇼츠를 업데이트
  useEffect(() => {
    if (videos.length === 0) {
      return;
    }

    if (!api) {
      return;
    }

    setSelectedVideo(videos[api.selectedScrollSnap()]);

    api.on('select', () => {
      setSelectedVideo(videos[api.selectedScrollSnap()]);
    });
  }, [api, videos]);

  // 선택된 비디오가 변경되면
  useEffect(() => {
    if (!selectedVideo) {
      return;
    }

    refetchShortsDetailData();
  }, [selectedVideo]);

  useEffect(() => {
    if (currentTime > 0) {
      logCurrentTime();
    }
  }, [shortsDetailData]);

  return (
    <div className="h-full bg-stone-900">
      {/* <div className="text-white">{currentTime}</div> */}
      <div className={'flex w-full justify-center gap-20 p-4'}>
        <section className="inset-x-0 flex w-[600px] items-end gap-4 text-white">
          {/* video layout */}
          <div ref={carouselRef} className="h-full w-full">
            <Carousel
              setApi={setApi}
              opts={{
                align: 'start',
              }}
              orientation="vertical"
              className="w-full"
            >
              <CarouselContent className="flex h-[1000px] flex-col gap-4 rounded-lg">
                {videos.map((info: any) => (
                  <ShortsDetailCarouselItem
                    key={info.id}
                    title={info.title}
                    shortsDetailData={shortsDetailData?.data}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                  />
                ))}
                <CarouselItem
                  className="flex h-full w-full items-center justify-center"
                  ref={lastVideoElementRef}
                >
                  <LoadingSpinner size="large" />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          {/* button layout */}
          <ShortsButtonLayout
            selectedVideoInfo={shortsDetailData?.data}
            setOpenComments={setOpenComments}
            resetVideoInfo={refetchShortsDetailData}
          />
        </section>
        {openComments && (
          <aside className="h-full w-[480px]">
            {selectedVideo && (
              <ShortsCommentsCard
                shortsId={selectedVideo?.id}
                setOpenComments={setOpenComments}
              />
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default ShortsPage;
