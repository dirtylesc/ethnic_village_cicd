'use client';

import { memo, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Bookmark } from '@/types/bookmark.type';
import { Tour } from '@/types/tour.type';
import { useTourListByIds } from '@/hooks/api/useTour';
import { Button } from '@/components/ui/button';
import { TourItem } from '@/components/features/tour/tour-card';

type TourBookmarksTabProps = {
  bookmarks?: Bookmark[];
  visibleItems: number;
  onLoadMore: () => void;
}

function TourBookmarksTab({ bookmarks, visibleItems, onLoadMore }: TourBookmarksTabProps) {
  const t = useTranslations('personal.bookmark');
  const tourIds = useMemo(
    () => bookmarks?.slice(0, visibleItems).map(bookmark => bookmark.entityId) || [],
    [bookmarks, visibleItems],
  );

  const { data, isLoading } = useTourListByIds(tourIds);

  const orderedTours = useMemo(() => {
    if (!data) return [];

    return tourIds.map(id => data.find((tour: Tour) => tour.id === id)).filter((tour): tour is Tour => !!tour);
  }, [data, tourIds]);

  const hasMoreItems = visibleItems < (bookmarks?.length || 0);

  if (isLoading && tourIds.length > 0 && orderedTours.length === 0) {
    return <div className="w-full text-center">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        {orderedTours.map(tour => (
          <TourItem key={tour.id} tour={tour} layout="horizontal" />
        ))}
      </div>
      {hasMoreItems && (
        <div className="mt-8 flex justify-center">
          <Button onClick={onLoadMore} variant="outline" className="gap-2 px-8">
            {t('view_more')}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(TourBookmarksTab);
