'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18n-navigation';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/shared/section-container';

export function AboutCTA() {
  const t = useTranslations('about.cta');

  return (
    <SectionContainer background="gray">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl">{t('title')}</h2>
        <p className="mb-8 text-lg text-gray-600">{t('description')}</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-primary-500 hover:bg-primary-600">
            <Link href="/tour">{t('explore_tours')}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">{t('contact_us')}</Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
