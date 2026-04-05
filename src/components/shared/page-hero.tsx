'use client';

import Image from 'next/image';
import { cn } from '@/utils';

type PageHeroProps = {
  title: string;
  description?: string;
  backgroundImage: string;
  className?: string;
}

export function PageHero({ title, description, backgroundImage, className }: PageHeroProps) {
  return (
    <section
      className={cn('full-bleed relative mt-[-80px] overflow-hidden', 'h-[400px] sm:h-[450px] lg:h-[500px]', className)}
    >
      
      <div className="absolute inset-0">
        <Image src={backgroundImage} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container relative mx-auto flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:mb-4 sm:text-4xl lg:text-5xl xl:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto max-w-3xl text-base text-gray-200 sm:text-lg lg:text-xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
