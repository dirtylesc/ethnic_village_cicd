'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { setDefaultHeaders } from '@/core/api';
import { AppConstant } from '@/core/constants/app';
import { RouteConstant } from '@/core/constants/route';
import { cn } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

import { routing } from '@/libs/i18n-navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const segments = pathname.split('/');

    if (AppConstant.defaultLocale === locale) {
      segments.splice(1, 0, newLocale);
    } else {
      segments[1] = newLocale;
    }

    const newPath = segments.join('/');

    setDefaultHeaders({
      'Accept-Language': newLocale,
    });

    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-white/10 h-12 w-12 focus-visible:ring-0">
          <div className="flex items-center">
            <Image src={`/icons/${locale}.svg`} alt={locale} width={28} height={28} />
            <ChevronDown
              className={cn('ml-1 h-5 w-5', {
                'text-white': pathname.includes(RouteConstant.home),
              })}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map(loc => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn('flex items-center gap-2', {
              'bg-primary-500 font-semibold text-white focus:bg-primary-500 focus:text-white': loc === locale,
            })}
          >
            <Image src={`/icons/${loc}.svg`} alt={loc} width={28} height={28} />
            {AppConstant.locales[loc as keyof typeof AppConstant.locales]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
