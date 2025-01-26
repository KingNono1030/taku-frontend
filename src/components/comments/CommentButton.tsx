import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type CommentButtonProps = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};

const CommentButton = ({ onClickEdit, onClickDelete }: CommentButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit px-2 py-0">
        <ul className="flex flex-col">
          <li>
            <Button variant="ghost" onClick={onClickEdit}>
              <Pencil />
              수정
            </Button>
          </li>
          <li>
            <Button variant="ghost" onClick={onClickDelete}>
              <Trash2 />
              삭제
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default CommentButton;
