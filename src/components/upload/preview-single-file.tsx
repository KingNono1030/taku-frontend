// ----------------------------------------------------------------------

type Props = {
  imgUrl?: string;
};

export default function SingleFilePreview({ imgUrl = '' }: Props) {
  return (
    <div className="relative h-full w-full p-1">
      <img alt="file preview" src={imgUrl} className="h-full w-full rounded" />
    </div>
  );
}
