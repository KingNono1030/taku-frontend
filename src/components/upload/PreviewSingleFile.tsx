// ----------------------------------------------------------------------

type Props = {
  imgUrl?: string;
  alt?: string;
};

export default function SingleFilePreview({ imgUrl = '', alt }: Props) {
  return (
    <div className="relative h-full w-full p-1">
      <img alt={alt} src={imgUrl} className="h-full w-full rounded" />
    </div>
  );
}
