import { useCallback, useEffect, useRef, useState } from 'react';

import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AxiosResponse } from 'axios';
import { X } from 'lucide-react';

import CommentContent from '@/components/comments/CommentList';
import CommentMainForm from '@/components/comments/CommentMainForm';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ShortsButtonLayout from '@/components/shorts/ShortsButtonLayout';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import VideoPlayer from '@/components/video-player/VideoPlayer';
import { testAxios } from '@/lib/axiosInstance';

const ShortsPage = () => {
  const [openComments, setOpenComments] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);

  const [comments, setComments] = useState<any[]>([]);

  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState<any>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const logCurrentTime = () => {
    console.log('비디오 시간', currentTime);
    setCurrentTime(0);
  };

  // 쇼츠 리스트 가져오기
  const getVedioList = async (): Promise<AxiosResponse> => {
    return await testAxios.get('/api/shorts/recommend');
  };

  // 쇼츠 상세 정보 가져오기
  const getVedioDetail = async (shartsId: string): Promise<AxiosResponse> => {
    return await testAxios.get('/api/shorts/' + shartsId);
  };

  // 쇼츠 댓글 가져오기
  const getComments = async (shartsId: string): Promise<AxiosResponse> => {
    return await testAxios.get('/api/shorts/' + shartsId + '/comment');
  };

  //리셋 댓글목록
  const resetComments = (resCommentArr: any[]) => {
    setComments(resCommentArr);
  };

  const loadMoreVideos = () => {
    getVedioList().then((res) => {
      setVideos((prevVideos) => [...prevVideos, ...res.data.data]); // 기존 데이터에 새로운 비디오 추가
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

  // 비디오 정보 리셋
  const resetVideoInfo = () => {
    getVedioDetail(selectedVideo.id).then((res) => {
      setSelectedVideoInfo(res.data.data);
    });
  };

  // 선택된 비디오가 변경되면
  useEffect(() => {
    if (!selectedVideo) {
      return;
    }

    getVedioDetail(selectedVideo.id).then((res) => {
      setSelectedVideoInfo(res.data.data);
    });

    getComments(selectedVideo.id).then((res) => {
      console.log('댓글', res.data.data);
      if (res.data.data?.length > 0) {
        setComments(res.data.data);
        return;
      }
      setComments([]);
    });
  }, [selectedVideo]);

  useEffect(() => {
    if (currentTime > 0) {
      logCurrentTime();
    }
  }, [selectedVideoInfo]);

  return (
    <div className="h-full bg-stone-900">
      <div className="text-white">{currentTime}</div>
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
                {videos.map((info: any, index: number) => (
                  <CarouselItem key={index} className="w-full basis-11/12">
                    <div className="relative h-full w-full overflow-hidden rounded-lg">
                      <VideoPlayer
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                        src={
                          selectedVideoInfo?.m3u8_url
                            ? selectedVideoInfo?.m3u8_url
                            : ''
                        }
                        type="m3u8"
                      />
                      <div className="absolute bottom-20 left-0 z-10 bg-[#00000000] px-4 py-1 text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                        <div>
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={selectedVideoInfo?.profile_img_url}
                            />
                            <AvatarFallback>aa</AvatarFallback>
                          </Avatar>
                        </div>
                        <p>{info.title}</p>
                        <p>{info.description}</p>
                      </div>
                    </div>
                  </CarouselItem>
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
            selectedVideoInfo={selectedVideoInfo}
            setOpenComments={setOpenComments}
            resetVideoInfo={resetVideoInfo}
          />
        </section>
        {openComments && (
          <aside className="h-full w-[480px]">
            <Card className="h-full border border-[#ffffff20] bg-transparent text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-[#ffffff20] px-4 py-1">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="font-bold">댓글</h2>
                  <p className="text-base">{comments?.length}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setOpenComments(false)}
                  className="rounded-full"
                >
                  <X size={64} />
                </Button>
              </CardHeader>
              <CardContent className="h-full min-h-[800px]">
                <CommentContent commentsArr={comments} />
              </CardContent>
              <CardFooter className="flex items-start justify-between gap-2 border-t border-[#ffffff20] p-4">
                <CommentMainForm
                  parentId={selectedVideo?.id}
                  resetComments={resetComments}
                />
              </CardFooter>
            </Card>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ShortsPage;
