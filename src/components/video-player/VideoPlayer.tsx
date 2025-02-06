import { MutableRefObject, useEffect, useRef, useState } from 'react';

import Hls from 'hls.js';

type VideoPlayerProps = {
  src: string;
  type?: 'm3u8' | 'mp4';
};

const VideoPlayer = ({ src, type }: VideoPlayerProps) => {
  const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    console.log('비디오 끝', currentTime);
  };

  useEffect(() => {
    if (type === 'm3u8' && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      videoRef.current && hls.attachMedia(videoRef.current);
    }
  }, [src, type]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
  }, []);

  return type === 'm3u8' ? (
    <div className="h-full w-full bg-black">
      <video
        className="h-full w-full object-scale-down"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        ref={videoRef}
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
        src={src}
        controls
      />
    </div>
  );
};

export default VideoPlayer;
