import { PopoverTrigger } from '@radix-ui/react-popover';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '../ui/button';
import { Popover, PopoverContent } from '../ui/popover';
import ReportDialog from './ReportDialog';

const ReportButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit px-2 py-0">
        <ul className="flex flex-col gap-2">
          <li>
            <ReportDialog />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ReportButton;
