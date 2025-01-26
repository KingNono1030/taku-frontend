import { motion as m } from 'framer-motion';
import { X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

import FileThumbnail, { fileData } from '@/file-thumbnail';
import { fData } from '@/utils/format-number';

import { Button } from '../ui/button';
import { UploadProps } from './types';

// ----------------------------------------------------------------------

/**
 * 여러 파일의 미리보기를 제공하는 컴포넌트입니다.
 *
 * @param {Object} props - 컴포넌트의 props
 * @param {boolean} props.thumbnail - 썸네일을 표시할지 여부
 * @param {Array} props.files - 미리보기할 파일 목록
 * @param {Function} [props.onRemove] - 파일을 제거할 때 호출되는 콜백 함수
 *
 * @returns {JSX.Element} 여러 파일의 미리보기를 렌더링하는 JSX 요소
 */
export default function MultiFilePreview({
  thumbnail,
  files,
  onRemove,
}: UploadProps) {
  return (
    <AnimatePresence initial={false}>
      {files?.map((file) => {
        const { key, name = '', size = 0 } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <m.div
              key={key}
              initial={{ y: 120, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.6 },
              }}
              exit={{
                y: 120,
                opacity: 0,
                transition: { duration: 0.5 },
              }}
              className="relative m-1 h-20 w-20 overflow-hidden rounded-lg border border-gray-300"
            >
              <FileThumbnail tooltip imageView file={file} />

              {onRemove && (
                <Button
                  type="button"
                  size="icon"
                  onClick={() => onRemove(file)}
                  className="absolute right-1 top-1 h-6 w-6 rounded-full bg-gray-900 bg-opacity-50 p-1 text-white hover:bg-opacity-75"
                >
                  <X />
                </Button>
              )}
            </m.div>
          );
        }

        return (
          <m.div
            key={key}
            initial={{ y: 120, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.6 },
            }}
            exit={{
              y: 120,
              opacity: 0,
              transition: { duration: 0.5 },
            }}
            className="my-1 flex items-center space-x-2 rounded border border-gray-500 p-1.5"
          >
            <FileThumbnail file={file} />

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {isNotFormatFile ? file : name}
              </span>
              <span className="text-xs text-gray-500">
                {isNotFormatFile ? '' : fData(size)}
              </span>
            </div>

            {onRemove && (
              <Button type="button" size="icon" onClick={() => onRemove(file)}>
                <X width={16} />
              </Button>
            )}
          </m.div>
        );
      })}
    </AnimatePresence>
  );
}
