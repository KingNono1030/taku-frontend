import { ImageUp, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils.ts';

import { Button } from '../ui/button';
import RejectionFiles from './errors-rejection-files.tsx';
import MultiFilePreview from './preview-multi-file.tsx';
import SingleFilePreview from './preview-single-file.tsx';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onRemove,
  onRemoveAll,
  imageUrlList = [], // 수정 폼에서 preview 로 보여줄 url 리스트
  deleteImageUrlList = [], // 수정 폼에서 preview 로 보여줄 url 리스트 중 삭제되어야 하는 url 리스트
  onDeleteImageUrl, // 수정 폼에서 기존 이미지 삭제 요청 함수
  ...other
}: UploadProps & {
  imageUrlList?: string[];
  deleteImageUrlList?: string[];
  onDeleteImageUrl?: (url: string) => void;
}) {
  // useDropzone 훅을 사용하여 드롭존 관련 속성 및 상태를 가져옴
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  // 단일 파일이 있는지 여부를 확인
  const hasFile = !!file && !multiple;

  // 다중 파일이 있는지 여부를 확인
  const hasFiles = !!files && multiple && !!files.length;

  // 드래그 거부 또는 에러가 있는지 여부를 확인
  const hasError = isDragReject || !!error;

  // 파일이 없을 때 표시할 플레이스홀더 렌더링
  const renderPlaceholder = (
    <div className="flex flex-col flex-wrap items-center justify-center gap-3">
      <ImageUp color="#EAB308" size={40} />
      <div className="flex flex-col gap-1 text-center">
        <h6 className={'font-bold' + (hasError ? ' text-orange-600' : '')}>
          파일을 드롭하거나 선택하세요
        </h6>
      </div>
    </div>
  );

  // 단일 파일 미리보기를 렌더링
  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={typeof file === 'string' ? file : file?.preview}
    />
  );

  // 단일 파일 미리보기 제거 버튼 렌더링
  const removeSinglePreview = hasFile && onDelete && (
    <Button
      size="icon"
      onClick={onDelete}
      className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-1"
    >
      <X />
    </Button>
  );

  // 다중 파일 미리보기를 렌더링
  const renderMultiPreview = hasFiles && (
    <>
      <div className="my-2 inline-flex flex-wrap items-center gap-2">
        <MultiFilePreview
          files={files}
          thumbnail={thumbnail}
          onRemove={onRemove}
        />
      </div>

      <div className="flex justify-end gap-1.5">
        {onRemoveAll && (
          <Button onClick={onRemoveAll} variant="destructive">
            전체 삭제
          </Button>
        )}
      </div>
    </>
  );

  // 기존 이미지 URL의 프리뷰 렌더링
  const renderImageUrlPreview = imageUrlList.length > 0 && (
    <div className="my-2 inline-flex flex-wrap items-center gap-2">
      {imageUrlList
        .filter((item) => !deleteImageUrlList.includes(item))
        .map((url) => (
          <div
            key={url}
            className="relative m-1 h-20 w-20 overflow-hidden rounded-lg border border-gray-300"
          >
            <img src={url} alt="uploaded" className={cn('object-cover')} />
            <Button
              type="button"
              size="icon"
              onClick={() => {
                if (!onDeleteImageUrl) return;
                onDeleteImageUrl(url);
              }}
              className="absolute right-1 top-1 h-6 w-6 rounded-full bg-gray-900 bg-opacity-50 p-1 text-white hover:bg-opacity-75"
            >
              <X />
            </Button>
          </div>
        ))}
    </div>
  );

  // 컴포넌트 렌더링
  return (
    <div className="relative w-full">
      <div
        {...getRootProps()}
        className={
          'transition-padding relative cursor-pointer overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-100 p-5 outline-none transition-opacity hover:opacity-80' +
          (isDragActive ? ' opacity-70' : '') +
          (disabled ? ' opacity-48 pointer-events-none' : '') +
          (hasError ? ' border-red-500 bg-red-100' : '') +
          (hasFile ? ' p-0' : '')
        }
      >
        <input {...getInputProps()} />
        {hasFile ? renderSinglePreview : renderPlaceholder}
      </div>
      {removeSinglePreview}
      {helperText && helperText}
      <RejectionFiles fileRejections={fileRejections} />
      {renderImageUrlPreview}
      {renderMultiPreview}
    </div>
  );
}
