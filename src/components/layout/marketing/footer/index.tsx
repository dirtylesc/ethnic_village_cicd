'use client';

import { usePathname } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { cn } from '@/utils';

import Container from '@/components/ui/container';

import FooterCopyright from './FooterCopyright';
import FooterLogo from './FooterLogo';
import FooterNavLinks from './FooterNavLinks';
import FooterNewsletter from './FooterNewsletter';

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer className="relative mt-[70px] w-full bg-[#1C2930] text-white">
      <Container>
        <div
          className={cn('mt-[168px] flex w-full flex-col sm:mt-[130px]', {
            'mt-[48px] sm:mt-[48px]': pathname !== RouteConstant.home,
          })}
        >
          <div className="flex w-full flex-col justify-between gap-4 pb-6 md:gap-8 lg:flex-row lg:gap-[70px]">
            <FooterLogo />

            <FooterNavLinks />
          </div>

          <FooterCopyright />
        </div>

        <FooterNewsletter />
      </Container>
    </footer>
  );
};

export default Footer;
