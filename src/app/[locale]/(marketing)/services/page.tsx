import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ServicesHero, ServicesList } from '@/components/features/services';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'services.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ServicesPage() {
  return (
    <div className="flex w-full flex-col">
      <ServicesHero />
      <ServicesList />
    </div>
  );
}
