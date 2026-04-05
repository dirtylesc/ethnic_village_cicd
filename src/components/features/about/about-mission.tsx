'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/shared/section-container';

export function AboutMission() {
  const t = useTranslations('about.mission');

  return (
    <SectionContainer>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-dark sm:text-4xl">{t('title')}</h2>
        <p className="mb-8 text-center text-lg leading-relaxed text-gray-700">{t('content')}</p>

        <div className="mt-12">
          <h3 className="mb-4 text-2xl font-semibold text-dark">{t('subtitle')}</h3>
          <p className="text-lg leading-relaxed text-gray-700">{t('story')}</p>
        </div>
      </div>
    </SectionContainer>
  );
}
