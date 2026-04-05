'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { getErrorMessage } from '@/utils/handle-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { LoginFormValues, loginSchema } from '@/libs/schemas/auth';
import { useLogin } from '@/hooks/api/useAuth';
import { useApiUserDetailsGet } from '@/hooks/api/useUser';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function LoginPopup() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginOpen, setAuth, setLoginOpen, setSignupOpen, setForgotPasswordOpen, closeAllPopups } = useAuthStore();
  const { mutateAsync: login, isPending } = useLogin();
  const { refetch: refetchUserDetails } = useApiUserDetailsGet();

  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, user } = response.data;

        closeAllPopups();

        setAuth({
          accessToken,
          refreshToken,
          user,
        });

        refetchUserDetails();

        form.reset();

        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
          router.push(redirectUrl);
          return;
        }

        if (user.roles.includes('ADMIN') || user.roles.includes('ROLE_ADMIN')) {
          router.push('/admin');
        } else if (user.roles.includes('ROLE_TOUR_AGENCY') || user.roles.includes('TOUR_AGENCY')) {
          router.push('/admin/assigned-available-dates');
        } else {
          router.push('/');
        }
      } else {
        toast({
          title: response.message || 'Đăng nhập thất bại',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleSignupClick = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const handleForgotPasswordClick = () => {
    setLoginOpen(false);
    setForgotPasswordOpen(true);
  };

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="flex flex-col gap-[30px] p-8">
        <div className="flex flex-col gap-4">
          <Image src="/icons/logo.svg" alt="Ethnic Village Travel" width={64} height={64} className="object-contain" />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[5px]">
              <h2 className="text-[30px] font-bold leading-[1.17]">{t('welcome')} 👋</h2>
              <p className="text-gray-500">{t('please_login')}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('email')}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t('email_placeholder')}
                            className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                            {...field}
                          />
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
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t('password_placeholder')}
                            className="h-[44px] rounded-[10px] border-gray-500 px-3 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-sm font-normal"
                        onClick={handleForgotPasswordClick}
                      >
                        {t('forgot_password')}
                      </Button>
                    </div>

                    <div className="flex items-center justify-end gap-1 text-sm">
                      <span className="text-dark-900">{t('no_account')}</span>
                      <Button type="button" variant="link" className="p-0 font-bold" onClick={handleSignupClick}>
                        {t('signup')}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="hover:bg-primary/90 h-14 w-full rounded-[10px] bg-primary text-base font-normal text-white"
                    disabled={isPending}
                  >
                    {isPending ? t('signing_in') : t('sign_in')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
