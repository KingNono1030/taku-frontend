import { ImageOff } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type FallbackImageProps = {
  src: string;
  alt?: string;
  className?: string;
};

const FallbackImage = ({ src, alt, className }: FallbackImageProps) => {
  return (
    <Avatar className={'h-full w-full rounded-none ' + className}>
      <AvatarImage
        src={src}
        alt={alt ?? ''}
        className="h-full w-full object-cover"
      />
      <AvatarFallback className="rounded-none [&_svg]:size-10">
        <ImageOff color="#b1b1b1" />
      </AvatarFallback>
    </Avatar>
  );
};

export default FallbackImage;
