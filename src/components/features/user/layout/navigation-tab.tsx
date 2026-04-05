'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import { cn, getInitialName } from '@/utils';
import { ChevronRight, Heart, LogOut, Menu, Receipt, UserCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { logout } from '@/libs/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PersonalNavigationTab() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('personal.navigation');
  const { user } = useAuthStore();
  const { details } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const firstName = useMemo(() => user?.personal?.firstName || '', [user]);
  const lastName = useMemo(() => user?.personal?.lastName || '', [user]);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User';

  const navigationItems = useMemo(
    () => [
      {
        href: RouteConstant.personal_bookmark,
        label: t('bookmark'),
        icon: Heart,
        badge: details?.bookmarks?.filter(b => b.status === BookmarkStatus.ACTIVE).length || null,
      },
      {
        href: RouteConstant.personal_transaction,
        label: t('transaction'),
        icon: Receipt,
        badge: details?.pendingPaymentBookingsCount || null,
      },
      {
        href: RouteConstant.personal_account,
        label: t('account'),
        icon: UserCircle,
      },
    ],
    [details?.bookmarks, details?.pendingPaymentBookingsCount, t],
  );

  const handleLogout = () => {
    router.push(RouteConstant.home);
    setTimeout(() => {
      logout();
    }, 0);
  };

  const isPathActive = (href: string) => {
    const pathnameWithoutLocale = pathname.replace(/^\/(en|vi)/, '');
    return pathnameWithoutLocale === href || pathname === href;
  };

  const SidebarContent = () => (
    <div className="space-y-4">
      
      <Card className="overflow-hidden">
        <div className="relative h-20 bg-gradient-to-br from-primary via-primary-600 to-secondary">
          <div className="absolute -bottom-8 left-4">
            <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
              <AvatarImage src={user?.personal?.avatar} alt={fullName} className="object-cover" />
              <AvatarFallback className="bg-white text-lg font-bold text-primary">
                {getInitialName(firstName, lastName) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pb-4 pt-10">
          <h2 className="font-roboto text-lg font-bold text-foreground">{fullName}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{user?.email}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Heart className="h-4 w-4 text-primary" />
                <p className="font-roboto text-xl font-bold text-primary">
                  {details?.bookmarks?.filter(b => b.status === BookmarkStatus.ACTIVE).length || 0}
                </p>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground">{t('saved')}</p>
            </div>
            <div className="rounded-lg bg-secondary/5 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Receipt className="h-4 w-4 text-primary" />
                <p className="font-roboto text-xl font-bold text-primary">
                  {details?.pendingPaymentBookingsCount || 0}
                </p>
              </div>
              <p className="mt-1 text-xs font-medium text-foreground">{t('pending')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-2">
          <nav>
            <ul className="space-y-1">
              {navigationItems.map(item => {
                const IconComponent = item.icon;
                const isActive = isPathActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'group flex items-center justify-between rounded-lg px-3 py-3 font-roboto transition-all',
                        isActive ? 'bg-primary text-white shadow-sm' : 'text-foreground hover:bg-muted',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg transition-all',
                            isActive ? 'bg-white/20' : 'bg-muted group-hover:bg-muted-foreground/10',
                          )}
                        >
                          <IconComponent className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <Badge className={cn('bg-primary font-roboto text-xs text-white')}>{item.badge}</Badge>
                      ) : (
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform group-hover:translate-x-1',
                            isActive ? 'text-white/70' : 'text-muted-foreground',
                          )}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Separator className="my-3" />

            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-between rounded-lg px-3 py-3 font-roboto text-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-all group-hover:bg-destructive/20">
                  <LogOut className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium">{t('logout')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      
      <aside className="sticky top-24 hidden w-full lg:block">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-custom-blue transition-all hover:scale-105 hover:shadow-xl lg:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-5 shadow-2xl transition-transform duration-300 ease-out lg:hidden',
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
        <SidebarContent />
        <div className="h-20" />
      </aside>
    </>
  );
}
