import { MutableRefObject, useEffect, useRef, useState } from 'react';

import Hls from 'hls.js';

import { useRecordShortsWatchTime } from '@/queries/shorts';
import useShortsStore from '@/store/shortsStore';

type VideoPlayerProps = {
  src: string;
  type?: 'm3u8' | 'mp4';
  shortsId: string;
};

const VideoPlayer = ({ src, type, shortsId }: VideoPlayerProps) => {
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const [isSrcLoaded, setIsSrcLoaded] = useState(false);

  const { watchTime, setWatchTime, resetWatchTime, setDurationTime } =
    useShortsStore();

  const { mutate: recordWatchTime } = useRecordShortsWatchTime({
    shortsId,
  });

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setWatchTime(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    recordWatchTime({
      playTime: watchTime,
      viewTime: watchTime,
    });
    // 다시 재생
    videoRef.current && videoRef.current.play();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      console.log('비디오 메타데이터 로드', videoRef.current.duration);
      setDurationTime(videoRef.current.duration);
    }
  };

  useEffect(() => {
    if (type === 'm3u8' && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      videoRef.current && hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsSrcLoaded(true);
      });
    } else {
      setIsSrcLoaded(true);
    }
  }, [src, type]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    resetWatchTime();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isSrcLoaded) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.7, // 비디오가 70% 이상 보일 때 재생
      },
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [isSrcLoaded]);

  return type === 'm3u8' ? (
    <div className="h-full w-full bg-black">
      <video
        className="h-full w-full object-scale-down"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        controls
      />
    </div>
  ) : (
    <div className="h-full w-full bg-black">
      <video
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        src={src}
        controls
      />
    </div>
  );
};

export default VideoPlayer;
