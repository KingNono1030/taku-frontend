import { Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import RejectionFiles from './errors-rejection-files';
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

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const imgUrl = typeof file === 'string' ? file : file?.preview;

  const renderPreview = hasFile && (
    <img alt="avatar" src={imgUrl} className="h-full w-full rounded-full" />
  );

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
  );

  const renderContent = (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      {renderPreview}
      {renderPlaceholder}
    </div>
  );

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

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}
