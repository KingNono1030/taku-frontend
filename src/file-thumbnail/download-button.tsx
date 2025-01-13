import { CircleChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

// ----------------------------------------------------------------------

type Props = {
  onDownload?: VoidFunction;
};

export default function DownloadButton({ onDownload }: Props) {
  return (
    <Button
      size="icon"
      onClick={onDownload}
      className="absolute right-0 top-0 z-10 h-full w-full bg-gray-800 text-white opacity-0 transition-opacity hover:opacity-100"
    >
      <CircleChevronDown size={24} />
    </Button>
  );
}
