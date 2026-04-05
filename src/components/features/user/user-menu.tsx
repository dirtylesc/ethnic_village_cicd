'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/classnames';
import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/libs/auth';
import { useIsHomePage } from '@/hooks/use-is-home-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserMenu = () => {
  const t = useTranslations('layout.header.user_menu');
  const router = useRouter();
  const { user } = useAuthStore();
  const isHomePage = useIsHomePage();

  const handleLogout = () => {
    router.push(RouteConstant.home);
    setTimeout(() => {
      logout();
      router.refresh();
    }, 0);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-3 py-1 hover:bg-white-10">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.personal?.avatar || user.avatar} />
              <AvatarFallback className={isHomePage ? 'bg-white/20 text-white' : 'bg-gray-200 text-black'}>
                {user.personal?.firstName?.[0]}
                {user.personal?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className={cn('max-w-[100px] truncate', isHomePage ? 'text-white' : 'text-black')}>
              {user.personal?.firstName} {user.personal?.lastName}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleNavigate(RouteConstant.personal_bookmark)}>
            {t('profile.favorites')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate(RouteConstant.personal_transaction)}>
            {t('profile.transactions')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate(RouteConstant.personal_account)}>
            {t('profile.edit_profile')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>{t('profile.logout')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
