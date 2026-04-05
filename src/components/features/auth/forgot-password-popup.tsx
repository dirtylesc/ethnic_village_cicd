'use client';

import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/libs/schemas/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function ForgotPasswordPopup() {
  const t = useTranslations('auth.forgot_password');
  const { forgotPasswordOpen, setForgotPasswordOpen, setLoginOpen, setEnterOtpOpen, setOtpEmail } = useAuthStore();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    setOtpEmail(values.email);
    setForgotPasswordOpen(false);
    setEnterOtpOpen(true);
  };

  const handleBackToLogin = () => {
    setForgotPasswordOpen(false);
    setLoginOpen(true);
  };

  return (
    <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
      <DialogContent className="flex flex-col gap-[30px] p-8">
        <div className="flex items-center gap-[5px]">
          <Button variant="ghost" className="h-6 w-6 p-0" onClick={handleBackToLogin}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <span className="text-base font-normal">{t('back')}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Image src="/icons/logo.svg" alt="Ethnic Village Travel" width={64} height={64} className="object-contain" />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-[5px]">
              <h2 className="text-[30px] font-bold leading-[1.17]">{t('title')}</h2>
              <p className="text-gray-500">{t('description')}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
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
                </div>

                <Button
                  type="submit"
                  className="hover:bg-primary/90 h-14 w-full rounded-[10px] bg-primary text-base font-normal text-white"
                >
                  {t('send_otp')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
