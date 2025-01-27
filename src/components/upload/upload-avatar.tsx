import { Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import RejectionFiles from './ErrorsRejectionFiles';
import { UploadProps } from './types';

// ----------------------------------------------------------------------
export default function UploadAvatar({
  error,
  file,
  disabled,
  helperText,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    disabled,
    accept: {
      'image/*': [],
    },
    ...other,
  });

  const hasFile = !!file; // 파일이 있는지 여부

  const hasError = isDragReject || !!error; // 에러가 있는지 여부

  const imgUrl = typeof file === 'string' ? file : file?.preview; // 파일의 URL

  const renderPreview = hasFile && (
    <img alt="avatar" src={imgUrl} className="h-full w-full rounded-full" />
  ); // 파일이 있을 때 미리보기 렌더링

  const renderPlaceholder = (
    <div
      className={`upload-placeholder absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center space-y-1 rounded-full transition-opacity ${
        hasError
          ? 'bg-red-100 text-red-500'
          : hasFile
            ? 'bg-opacity-64 bg-gray-900 text-white opacity-0'
            : 'bg-gray-100 text-gray-500'
      }`}
    >
      <Camera width={32} />

      <span className="text-xs">{file ? 'Update photo' : 'Upload photo'}</span>
    </div>
  ); // 파일이 없을 때 플레이스홀더 렌더링

  const renderContent = (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      {renderPreview}
      {renderPlaceholder}
    </div>
  ); // 미리보기와 플레이스홀더를 포함한 컨텐츠 렌더링

  return (
    <>
      <div
        {...getRootProps()}
        className={`m-auto h-36 w-36 cursor-pointer overflow-hidden rounded-full border border-dashed p-1 ${
          isDragActive ? 'opacity-72' : ''
        } ${disabled ? 'opacity-48 pointer-events-none' : ''} ${
          hasError ? 'border-red-500' : 'border-gray-500'
        } ${hasFile && hasError ? 'bg-red-100' : ''}`}
      >
        <input {...getInputProps()} />

        {renderContent}
      </div>
      {/* 헬퍼 텍스트 렌더링 */}
      {helperText && helperText}
      {/* 파일 거부 에러 */}
      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}
