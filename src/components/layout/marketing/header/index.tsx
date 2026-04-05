'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ClassNameValue } from 'tailwind-merge';

import { logout } from '@/libs/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AuthPopup } from '@/components/features/auth';
import { UserMenu } from '@/components/features/user';
import LanguageSwitcher from '@/components/shared/language-switcher';

type HeaderProps = {
  navItemClassName?: ClassNameValue;
};

const Header = ({ navItemClassName }: HeaderProps) => {
  const t = useTranslations('layout.header');
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setLoginOpen, setSignupOpen } = useAuthStore();

  const navLinks = [
    { name: t('nav.home'), href: RouteConstant.home },
    { name: t('nav.about'), href: RouteConstant.about },
    { name: t('nav.services'), href: RouteConstant.services },
    { name: t('nav.blog'), href: RouteConstant.blog },
    { name: t('nav.contact'), href: RouteConstant.contact },
  ];

  const handleSignInClick = () => {
    setLoginOpen(true);
    setIsMenuOpen(false);
  };

  const handleSignUpClick = () => {
    setSignupOpen(true);
    setIsMenuOpen(false);
  };

  console.log(user);

  const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => (
    <ul className={cn('flex items-center gap-6 2xl:gap-8', isMobileNav && 'flex-col items-start gap-4 space-y-2')}>
      {navLinks.map(link => (
        <li key={link.name}>
          <Link
            href={link.href}
            onClick={() => isMobileNav && setIsMenuOpen(false)}
            aria-current={pathname === link.href ? 'page' : undefined}
            className={cn(
              'relative text-base font-bold transition-colors',
              'hover:text-primary-500 hover:before:w-full',
              'before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:w-0 before:bg-primary-500 before:transition-all before:duration-300 before:ease-in-out',
              navItemClassName,
              {
                'text-white':
                  !pathname.includes('tour') && !pathname.includes('order') && !pathname.includes('payment'),
                'text-primary-500 before:w-full': pathname === link.href,
              },
              isMobileNav && 'py-2 text-lg text-dark',
            )}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className={cn('absolute left-0 right-0 top-0 z-50 w-full', {})}>
      <Container>
        <div className="flex w-full items-center justify-center bg-transparent py-2 lg:py-4">
          <div className="flex w-full items-center justify-between gap-2 lg:gap-4">
            <Link href="/" className="flex flex-shrink-0 items-center" aria-label="Trang chủ - Ethnic Village Travel">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-in-out hover:scale-110 lg:h-12 lg:w-12">
                <Image
                  src="/icons/logo.svg"
                  alt="Ethnic Village Travel"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>

            <nav className="hidden lg:flex">
              <NavLinks />
            </nav>

            <div className="flex items-center gap-1 lg:gap-2">
              <LanguageSwitcher />

              <div className="hidden items-center gap-1 text-sm lg:flex">
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary-500 text-primary-500 hover:text-primary-500"
                      onClick={handleSignInClick}
                      aria-label={t('auth.sign_in')}
                    >
                      {t('auth.sign_in')}
                    </Button>
                    <Button
                      className="bg-primary-500 text-white"
                      onClick={handleSignUpClick}
                      aria-label={t('auth.sign_up')}
                    >
                      {t('auth.sign_up')}
                    </Button>
                  </>
                )}
              </div>

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 h-10 w-10 text-white hover:text-white focus-visible:ring-0 lg:hidden"
                    aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
                    aria-expanded={isMenuOpen}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 flex flex-col gap-6">
                    <NavLinks isMobileNav />
                    {!user && (
                      <div className="flex flex-col gap-3 border-t pt-4">
                        <Button
                          variant="outline"
                          className="w-full border-primary-500 text-primary-500 hover:text-primary-500"
                          onClick={handleSignInClick}
                          aria-label={t('auth.sign_in')}
                        >
                          {t('auth.sign_in')}
                        </Button>
                        <Button
                          className="w-full bg-primary-500 text-white"
                          onClick={handleSignUpClick}
                          aria-label={t('auth.sign_up')}
                        >
                          {t('auth.sign_up')}
                        </Button>
                      </div>
                    )}
                    {user && (
                      <div className="flex flex-col gap-2 border-t pt-4">
                        <div className="mb-2 flex items-center gap-3 px-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.personal?.avatar || user.avatar} />
                            <AvatarFallback className="bg-gray-200 text-black">
                              {user.personal?.firstName?.[0]}
                              {user.personal?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {user.personal?.firstName} {user.personal?.lastName}
                            </span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMenuOpen(false);
                            router.push(RouteConstant.personal_bookmark);
                          }}
                        >
                          {t('user_menu.profile.favorites')}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMenuOpen(false);
                            router.push(RouteConstant.personal_transaction);
                          }}
                        >
                          {t('user_menu.profile.transactions')}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsMenuOpen(false);
                            router.push(RouteConstant.personal_account);
                          }}
                        >
                          {t('user_menu.profile.edit_profile')}
                        </Button>
                        <div className="border-t pt-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={() => {
                              setIsMenuOpen(false);
                              logout();
                              router.push(RouteConstant.home);
                            }}
                          >
                            {t('user_menu.profile.logout')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </Container>

      <AuthPopup />
    </header>
  );
};

export default Header;
