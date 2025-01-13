import { ImageUp, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

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
  ...other
}: UploadProps) {
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

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

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

  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={typeof file === 'string' ? file : file?.preview}
    />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <Button
      size="icon"
      onClick={onDelete}
      className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-1"
    >
      <X />
    </Button>
  );

  const renderMultiPreview = hasFiles && (
    <>
      <div className="my-2 flex flex-wrap items-center gap-2">
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
      {renderMultiPreview}
    </div>
  );
}
