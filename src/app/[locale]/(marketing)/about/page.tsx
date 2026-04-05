import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AboutCTA, AboutHero, AboutMission, AboutStats, AboutValues } from '@/components/features/about';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStats />
      <AboutCTA />
    </div>
  );
}
