'use client';

import { Calendar, Compass, HeadphonesIcon, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/shared/section-container';

import { ServiceCard } from './service-card';

const serviceCategories = [
  {
    id: 'tour-booking',
    icon: Calendar,
    titleKey: 'list.tour_booking.title',
    descriptionKey: 'list.tour_booking.description',
    featuresKey: 'list.tour_booking.features',
    ctaLink: '/tour',
    ctaTextKey: 'list.tour_booking.cta',
  },
  {
    id: 'custom-tours',
    icon: Compass,
    titleKey: 'list.custom_tours.title',
    descriptionKey: 'list.custom_tours.description',
    featuresKey: 'list.custom_tours.features',
    ctaLink: '/contact',
    ctaTextKey: 'list.custom_tours.cta',
  },
  {
    id: 'guide-services',
    icon: HeadphonesIcon,
    titleKey: 'list.guide_services.title',
    descriptionKey: 'list.guide_services.description',
    featuresKey: 'list.guide_services.features',
  },
  {
    id: 'additional-services',
    icon: MapPin,
    titleKey: 'list.additional_services.title',
    descriptionKey: 'list.additional_services.description',
    featuresKey: 'list.additional_services.features',
  },
] as const;

export function ServicesList() {
  const t = useTranslations('services');

  return (
    <SectionContainer>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl">{t('list.title')}</h2>
          <p className="text-gray-600">{t('list.subtitle')}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {serviceCategories.map(service => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              titleKey={service.titleKey}
              descriptionKey={service.descriptionKey}
              featuresKey={service.featuresKey}
              ctaLink={'ctaLink' in service ? service.ctaLink : undefined}
              ctaTextKey={'ctaTextKey' in service ? service.ctaTextKey : undefined}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
