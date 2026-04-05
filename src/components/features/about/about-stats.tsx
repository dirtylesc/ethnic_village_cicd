'use client';

import { Calendar, Home, MapPin, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/shared/section-container';

const statIcons = {
  years_experience: Calendar,
  tours_completed: MapPin,
  happy_customers: Users,
  villages_partnered: Home,
};

export function AboutStats() {
  const t = useTranslations('about.stats');
  const stats = ['years_experience', 'tours_completed', 'happy_customers', 'villages_partnered'] as const;

  return (
    <SectionContainer>
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-dark sm:text-4xl">{t('title')}</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(stat => {
            const Icon = statIcons[stat];
            return (
              <div key={stat} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="mb-2 text-4xl font-bold text-primary-500">{t(`${stat}.value`)}</div>
                <div className="text-lg text-gray-600">{t(`${stat}.label`)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
