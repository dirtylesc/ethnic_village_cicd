'use client';

import Image from 'next/image';
import { cn } from '@/utils';

import { SearchBar } from './search-bar';

type HeroSectionProps = {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'full-bleed relative mt-[-80px] overflow-hidden',
        'h-[500px] sm:h-[550px] lg:h-[600px] xl:h-[650px]',
        className,
      )}
    >
      
      <div className="absolute inset-0">
        <Image src="/images/homepage_hero.jpg" alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative mx-auto flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mb-6 w-full text-center sm:mb-8 lg:mb-12">
          <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:mb-4 sm:text-4xl sm:leading-tight lg:px-8 lg:text-5xl xl:px-16 xl:text-6xl">
            Khám phá vẻ đẹp văn hóa dân tộc
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg lg:text-xl">
            Trải nghiệm những chuyến du lịch độc đáo đến các làng dân tộc thiểu số
          </p>
        </div>

        <div className="flex w-full max-w-6xl flex-col gap-4 px-2 sm:px-4 lg:px-8 xl:px-16">
          <SearchBar className="w-full" />
        </div>
      </div>
    </section>
  );
}
