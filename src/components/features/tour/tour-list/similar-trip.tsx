'use client';

import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';

import TourItem from '../tour-card/tour-item';
import { EmptyState } from './empty-state';

type SimilarTripProps = {
  tours: Tour[];
  className?: string;
}

const SimilarTrip = ({ tours, className }: SimilarTripProps) => {
  const t = useTranslations('tour.detail.similar');

  if (!tours?.length) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <EmptyState namespace="tour.detail.similar.empty" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <div className={cn(`grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`, className)}>
        {tours.map(tour => (
          <TourItem key={tour.id} tour={tour} layout="vertical" />
        ))}
      </div>
    </div>
  );
};

export default SimilarTrip;
