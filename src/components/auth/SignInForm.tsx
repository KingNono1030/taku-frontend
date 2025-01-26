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
import { signIn } from '@/services/auth';

const signinSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('유효한 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자리 이하이어야 합니다')
    .regex(/[a-z]/, '비밀번호에 최소 하나의 소문자가 포함되어야 합니다')
    .regex(/[A-Z]/, '비밀번호에 최소 하나의 대문자가 포함되어야 합니다')
    .regex(/[0-9]/, '비밀번호에 최소 하나의 숫자가 포함되어야 합니다')
    .regex(/[\W_]/, '비밀번호에 최소 하나의 특수 문자가 포함되어야 합니다'),
});

export const SignInForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signinSchema>) => {
    try {
      const data = await signIn(values);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-[#767676]">이메일</FormLabel>
              <FormControl className="h-14 p-4 text-[#767676] md:text-base">
                <Input placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#767676]">비밀번호</FormLabel>
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
