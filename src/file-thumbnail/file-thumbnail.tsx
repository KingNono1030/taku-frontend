import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import DownloadButton from './download-button';
import { fileData, fileFormat, fileThumb } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
};

/**
 * 파일 썸네일 컴포넌트를 렌더링합니다.
 *
 * @param {FileIconProps} props - 파일 썸네일 컴포넌트의 속성
 * @param {Object} props.file - 파일 데이터 객체
 * @param {string} [props.tooltip] - 툴팁 텍스트
 * @param {boolean} [props.imageView] - 이미지 뷰 모드 여부
 * @param {Function} [props.onDownload] - 다운로드 버튼 클릭 시 호출되는 함수
 * @returns {JSX.Element} 파일 썸네일 컴포넌트
 */
export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
}: FileIconProps) {
  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);

  const renderContent =
    format === 'image' && imageView ? (
      <img src={preview} className="h-full w-full flex-shrink-0 object-cover" />
    ) : (
      <img src={fileThumb(format)} className="h-8 w-8 flex-shrink-0" />
    );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-full w-full flex-shrink-0 items-center justify-center">
              {renderContent}
              {onDownload && <DownloadButton onDownload={onDownload} />}
            </div>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
