'use client';

import { TourServiceInfoType } from '@/core/enum/tour-service-info.enum';
import { CircleCheck, CircleMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type TourDetailOverviewProps = {
  tour: Tour;
}

export function TourDetailOverview({ tour }: TourDetailOverviewProps) {
  const t = useTranslations('tour.detail.overview');

  return (
    <div className="flex flex-col gap-[30px]">
      
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">{t('title')}</h3>
        <p className="text-[16px]">{tour.overview || t('no_overview')}</p>
        <div className="h-[1px] w-full bg-gray-20" />
      </div>

      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">{t('included_excluded')}</h3>
        <div className="grid grid-cols-2 gap-x-[30px]">
          <div className="space-y-[10px]">
            {tour.services
              ?.filter(service => service.type === TourServiceInfoType.INCLUDED)
              .map((service, index) => (
                <div key={service.id} className="flex items-center gap-[10px]">
                  <CircleCheck className="size-[24px] text-primary" />
                  <span className="text-[16px]">{service.name}</span>
                </div>
              ))}
          </div>
          <div className="space-y-[10px]">
            {tour.services
              ?.filter(service => service.type !== TourServiceInfoType.INCLUDED)
              .map((service, index) => (
                <div key={service.id} className="flex items-center gap-[10px]">
                  <CircleMinus className="size-[24px] text-secondary-500" />
                  <span className="text-[16px]">{service.name}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="h-[1px] w-full bg-gray-20" />
      </div>

      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-bold">{t('trip_plan')}</h3>
        <Accordion type="single" collapsible defaultValue="day-1" className="w-full">
          {tour.timeline?.map(day => (
            <AccordionItem
              key={day.day}
              value={`day-${day.day}`}
              className="border-b border-gray-20 py-[10px] last:border-0"
            >
              <AccordionTrigger className="flex items-center justify-between py-0 hover:no-underline [&[data-state=open]>div>img]:rotate-180">
                <h4 className="text-[18px] font-bold">{t('day_label', { day: day.day })}</h4>
              </AccordionTrigger>
              <AccordionContent className="pt-[10px]">
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="font-medium text-primary">{activity.time}</span>
                      <p className="text-[16px]">{activity.description}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
