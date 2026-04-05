import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { cn } from '@/utils';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const FooterNewsletter: React.FC = () => {
  const t = useTranslations('layout.footer.newsletter');
  const pathname = usePathname();
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: { email: string }) => {

  };

  return (
    <Card
      className={cn(
        'absolute -top-[66px] left-1/2 w-[90%] max-w-[920px] -translate-x-1/2 rounded-b-[30px] rounded-t-md border-none bg-white text-black sm:w-[85%] md:w-[80%]',
        { hidden: pathname !== RouteConstant.home },
      )}
    >
      <CardContent className="flex flex-col items-center gap-5 p-6">
        <h3 className="text-center text-base font-bold sm:text-xl md:text-2xl lg:text-3xl">{t('title')}</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[720px]">
            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-6 md:gap-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <div className="flex h-12 w-full items-center gap-[10px] rounded-lg border border-primary px-2 md:h-14">
                        <Mail className="h-4 w-4 text-primary md:h-5 md:w-5" />
                        <input
                          type="email"
                          placeholder={t('email_placeholder')}
                          className="w-full border-none text-xs text-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-12 w-full rounded-lg bg-secondary-500 px-4 py-3 font-bold text-white hover:bg-[#e56a31] sm:w-auto md:h-14 md:px-5 md:py-4"
              >
                {t('subscribe')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FooterNewsletter;
