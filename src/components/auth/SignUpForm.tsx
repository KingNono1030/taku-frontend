import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { RHFUploadAvatar } from '@/components/hook-form/RhfUpload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRegisterUser } from '@/queries/user';
import { checkNickname } from '@/services/user';
import { OAuthProvider } from '@/types/api/user.types';

const signupSchema = z.object({
  user: z.object({
    nickname: z.string().nonempty('닉네임을 입력해주세요'),
    provider_type: z.enum(['KAKAO', 'GOOGLE', 'NAVER']),
  }),
  profileImage: z
    .object({
      preview: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    })
    .optional()
    .transform((imageObj) => {
      if (!imageObj) return undefined;

      const file = new File([], imageObj.name, {
        type: imageObj.type,
        lastModified: Date.now(),
      });

      return Object.assign(file, { preview: imageObj.preview });
    }),
});

export const SignUpForm = ({
  token,
  provider,
}: {
  token: string;
  provider: OAuthProvider;
}) => {
  const [nicknameAvaibleMessage, setNicknameAvaibleMessage] = useState<
    string | null
  >(null);
  const { mutate } = useRegisterUser();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      user: {
        nickname: '',
        provider_type: provider,
      },
      profileImage: undefined,
    },
  });

  const { handleSubmit, control, watch, setValue, setError, clearErrors } =
    form;
  const values = watch();

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    const formData = new FormData();

    // user 객체를 JSON 문자열로 변환하여 추가
    const userBlob = new Blob([JSON.stringify(values.user)], {
      type: 'application/json',
    });
    formData.append('user', userBlob);

    // profileImage가 존재하면 추가
    if (values.profileImage) {
      formData.append('profileImage', values.profileImage);
    }

    mutate({ formData, token });
  };

  const handleCheckNickname = async () => {
    const nickname = values.user.nickname;
    const { data: isNicknameNotValid } = await checkNickname(nickname);
    console.log(isNicknameNotValid);
    isNicknameNotValid
      ? (setError('user.nickname', { message: '중복된 닉네임입니다.' }),
        setNicknameAvaibleMessage(null))
      : (clearErrors('user.nickname'),
        setNicknameAvaibleMessage('사용가능한 닉네임입니다.'));
  };

  const handleDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      // 이전 파일의 preview URL을 해제하여 메모리 누수를 방지
      if (values.profileImage?.preview) {
        URL.revokeObjectURL(values.profileImage.preview);
      }

      // 첫 번째 파일만 처리
      const [file] = acceptedFiles;

      if (file) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });

        // 단일 파일을 profileImage 필드에 설정
        setValue('profileImage', newFile, {
          shouldValidate: true,
        });
      }
    },
    [setValue, values.profileImage],
  );
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormField
            control={control}
            name="user.nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-[#767676]">
                  닉네임
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                    <Input placeholder="닉네임을 입력해주세요" {...field} />
                  </FormControl>
                  <Button
                    onClick={handleCheckNickname}
                    type="button"
                    className="h-full"
                    disabled={!values.user.nickname}
                  >
                    중복
                  </Button>
                </div>
                <FormMessage />
                {nicknameAvaibleMessage && (
                  <p className={cn('text-sm font-medium text-green-500')}>
                    {nicknameAvaibleMessage}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormLabel className="text-base text-[#767676]">프로필</FormLabel>
          <RHFUploadAvatar
            thumbnail
            name="profileImage"
            maxSize={3145728}
            onDrop={handleDropSingleFile}
          />
        </div>
        <div className="pt-10">
          <Button
            className="h-14 w-full bg-primary py-4 font-semibold text-white hover:bg-primary/90"
            type="submit"
          >
            회원가입하기
          </Button>
        </div>
      </form>
    </Form>
  );
};
