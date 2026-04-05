'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { ContactFormData, contactFormSchema } from '@/libs/schemas/contact';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: t('success'),
        variant: 'default',
      });

      form.reset();
    } catch (error) {
      toast({
        title: t('error'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-[800px] p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">{t('title')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('description')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('name.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email.label')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('email.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone.label')}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t('phone.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('message.label')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('message.placeholder')} rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary-500 text-white hover:bg-primary-600"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
