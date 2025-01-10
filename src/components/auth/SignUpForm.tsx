import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUp } from '@/services/authService';

const signupSchema = z.object({
  nickname: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('유효한 이메일 형식이 아닙니다'),
  phoneNumber: z
    .string()
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다')
    .max(10, '비밀번호는 최대 20자리 이하이어야 합니다'),
  authCode: z
    .string()
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다')
    .max(10, '비밀번호는 최대 20자리 이하이어야 합니다'),
});

export const SignUpForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nickname: '',
      phoneNumber: '',
      authCode: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const data = await signUp(values);
      navigate('/');
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        id="loginForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-[#767676]">닉네임</FormLabel>
              <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                <Input placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#767676]">휴대폰 번호</FormLabel>
              <FormControl className="mt-3 h-14 p-4 text-[#767676] md:text-base">
                <Input placeholder="비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#767676]">인증번호</FormLabel>
              <FormControl className="mt-3 h-14 p-4 text-[#767676] md:text-base">
                <Input placeholder="비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
