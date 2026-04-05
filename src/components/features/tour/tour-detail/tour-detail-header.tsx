'use client';

import { EntityType } from '@/core/constants/entity';
import { BookmarkStatus } from '@/core/enum/bookmark.enum';
import { useUserStore } from '@/stores/useUserStore';
import { calculateRatingStats } from '@/utils';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Separator } from '@/components/ui/separator';
import { BookmarkButton } from '@/components/shared/bookmark-button';
import StarRating from '@/components/shared/star-rating';

import AvailableTickets from './available-tickets';

const TourDetailHeader = (tour: Tour) => {
  const t = useTranslations('tour.detail');
  const ratingObj = calculateRatingStats(tour.reviews || []);
  const { details } = useUserStore();
  const isBookmarked = details?.bookmarks?.some(
    bookmark =>
      bookmark.entityId === tour.id &&
      bookmark.entityType === EntityType.TOUR &&
      bookmark.status === BookmarkStatus.ACTIVE,
  );

  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="text-2xl font-bold text-dark sm:text-3xl md:text-[40px]">{tour.title}</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 sm:text-sm">{t('review')}</span>
            <StarRating average={ratingObj.average} readOnly />
          </div>

          <Separator className="hidden h-[53px] sm:block" orientation="vertical" />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 sm:text-sm">{t('days')}</span>
            <span className="text-sm text-dark sm:text-base">
              {t('duration_format', { days: tour.duration || 0, nights: (tour.duration || 0) - 1 })}
            </span>
          </div>

          <Separator className="hidden h-[53px] sm:block" orientation="vertical" />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 sm:text-sm">{t('location')}</span>
            <span className="line-clamp-1 text-sm text-dark sm:text-base">
              {tour.locations?.map(location => location.city).join(' - ')}
            </span>
          </div>

          <Separator className="hidden h-[53px] sm:block" orientation="vertical" />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500 sm:text-sm">{t('ethnic')}</span>
            <span className="line-clamp-1 text-sm text-dark sm:text-base">
              {tour.ethnics?.map(ethnic => ethnic.name).join(' - ')}
            </span>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <BookmarkButton
            variant="outline"
            size="icon"
            entityId={tour.id?.toString() || '0'}
            entityType={EntityType.TOUR}
            isBookmarkedDefault={isBookmarked}
          />
        </div>
      </div>

      <AvailableTickets tour={tour} />
    </div>
  );
};

export default TourDetailHeader;
