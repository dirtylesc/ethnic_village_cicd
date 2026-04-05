'use client';

import { Award, Heart, Leaf, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/shared/section-container';

const valueIcons = {
  authenticity: Heart,
  sustainability: Leaf,
  community: Users,
  quality: Award,
};

export function AboutValues() {
  const t = useTranslations('about.values');
  const values = ['authenticity', 'sustainability', 'community', 'quality'] as const;

  return (
    <SectionContainer background="gray">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-dark sm:text-4xl">{t('title')}</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(value => {
            const Icon = valueIcons[value];
            return (
              <div
                key={value}
                className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg"
              >
                <div className="bg-primary-500/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Icon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dark">{t(`items.${value}.title`)}</h3>
                <p className="text-gray-600">{t(`items.${value}.description`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
