'use client';

import { useState } from 'react';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';

import { TourDetailOverview } from './tour-detail-overview';
import { TourDetailReviews } from './tour-detail-reviews';

type TourDetailContentProps = {
  tour: Tour;
}

const TABS = ['overview_tab', 'reviews_tab'] as const;
type Tab = (typeof TABS)[number];

export function TourDetailContent({ tour }: TourDetailContentProps) {
  const t = useTranslations('tour.detail');
  const [activeTab, setActiveTab] = useState<Tab>('overview_tab');

  return (
    <div className="w-full">
      
      <div className="relative mb-[30px] border-b border-gray-200 pb-3">
        <div className="flex gap-[30px]">
          {TABS.map(tab => (
            <button
              key={tab}
              className={cn('text-xl font-semibold transition-colors duration-300 hover:text-primary', {
                'text-primary': activeTab === tab,
              })}
              onClick={() => setActiveTab(tab)}
            >
              {t(tab)}
            </button>
          ))}
        </div>
        <div
          className={cn('absolute bottom-0 left-0 h-[3px] w-[84px] bg-primary transition-transform duration-300', {
            'translate-x-[0px]': activeTab === 'overview_tab',
            'w-[72px] translate-x-[112px]': activeTab === 'reviews_tab',
          })}
        />
      </div>

      {activeTab === 'overview_tab' ? <TourDetailOverview tour={tour} /> : <TourDetailReviews tour={tour} />}
    </div>
  );
}
