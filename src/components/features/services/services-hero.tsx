'use client';

import { useTranslations } from 'next-intl';

import { PageHero } from '@/components/shared/page-hero';

export function ServicesHero() {
  const t = useTranslations('services.hero');

  return <PageHero title={t('title')} description={t('description')} backgroundImage="/images/homepage_hero.jpg" />;
}
