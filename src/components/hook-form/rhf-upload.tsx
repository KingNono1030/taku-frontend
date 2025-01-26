import { Controller, useFormContext } from 'react-hook-form';

import { FormMessage } from '../ui/form';
import { Upload, UploadAvatar, UploadProps } from '../upload';

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormMessage className="text-center">{error.message}</FormMessage>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

/**
 * RHFUpload 컴포넌트는 React Hook Form과 통합된 파일 업로드 컴포넌트입니다.
 *
 * @param {string} name - 업로드 필드의 이름입니다.
 * @param {boolean} multiple - 다중 파일 업로드를 허용할지 여부를 나타냅니다.
 * @param {string} [helperText] - 업로드 필드에 대한 도움말 텍스트입니다.
 * @param {Props} other - 기타 추가 속성입니다.
 *
 * @returns {JSX.Element} 파일 업로드 컴포넌트를 반환합니다.
 */
export function RHFUpload({
  name,
  multiple,
  helperText,
  deleteImageListName,
  imageUrlList,
  ...other
}: Props & { deleteImageListName?: string; imageUrlList?: string[] }) {
  const { control, setValue, watch } = useFormContext();

  // 삭제된 이미지 URL을 관리하는 array
  const deleteImageUrlList = watch(deleteImageListName || '') || [];

  // 토글 방식으로 삭제/복구 관리
  const handleDeleteImageUrl = (url: string) => {
    // 삭제된 이미지를 deleteImageList에 추가
    if (!deleteImageListName) {
      console.error('deleteImageListName is undefined');
      return;
    }

    const updatedList = [...new Set(deleteImageUrlList), url];

    // react-hook-form 상태 동기화
    setValue(deleteImageListName, updatedList);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Upload
          multiple={multiple}
          accept={{ 'image/*': [] }}
          files={multiple ? field.value : undefined}
          file={!multiple ? field.value : undefined}
          error={!!error}
          disabled={!!error}
          helperText={
            (!!error || helperText) && (
              <FormMessage>{error ? error?.message : helperText}</FormMessage>
            )
          }
          {...(deleteImageListName && {
            imageUrlList: imageUrlList, // 수정 폼에서 preview로 보여줄 URL 리스트
            onDeleteImageUrl: handleDeleteImageUrl, // 기존 이미지 삭제 요청 함수
            deleteImageUrlList: deleteImageUrlList,
          })}
          {...other}
        />
      )}
    />
  );
}
