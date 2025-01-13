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
