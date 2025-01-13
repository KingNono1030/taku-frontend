// import { FileRejection } from 'react-dropzone';
import { fileData } from '@/file-thumbnail';
import { fData } from '@/utils/format-number';

// ----------------------------------------------------------------------

// type Props = {
//   fileRejections: FileRejection[];
// };

export default function RejectionFiles({ fileRejections }: any) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <div className="mt-3 border border-dashed border-red-500 bg-red-100 p-4">
      {fileRejections.map(({ file, errors }: any) => {
        const { path, size } = fileData(file);

        return (
          <div key={path} className="my-2">
            <p className="truncate font-semibold">
              {path} - {size ? fData(size) : ''}
            </p>

            {errors.map((error: any) => (
              <span key={error.code} className="text-sm">
                - {error.message}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
