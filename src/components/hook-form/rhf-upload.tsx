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

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control } = useFormContext();

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
          {...other}
        />
      )}
    />
  );
}
