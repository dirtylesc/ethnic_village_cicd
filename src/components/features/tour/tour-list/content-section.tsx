'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';

import { useFilteredTourList } from '@/hooks/api/useFilteredTourList';
import { useQueryConfig } from '@/hooks/use-query-config';
import { TourItem } from '@/components/features/tour/tour-card';
import PaginationClient from '@/components/shared/pagination-client';
import Loading from '@/components/shared/loading';

import { EmptyState } from './empty-state';
import { SORT_OPTIONS, TourHeader } from './header-section';

const ITEM_PER_PAGE = 12;

type ViewMode = 'grid' | 'list';

export default function TourContentSection() {
  const t = useTranslations('search');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryConfig = useQueryConfig();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const sortBy = searchParams.get('sort_by') || 'default';
  const order = searchParams.get('order') || 'desc';
  const currentSort = `${sortBy}-${order}`;

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const [newSortBy, newOrder] = value.split('-');

    if (newSortBy === SORT_OPTIONS.DEFAULT.sortBy) {
      newParams.delete('sort_by');
      newParams.delete('order');
    } else {
      newParams.set('sort_by', newSortBy);
      newParams.set('order', newOrder);
    }

    router.push(`?${newParams.toString()}`);
  };

  const { tours, totalPages, isLoading } = useFilteredTourList(ITEM_PER_PAGE);
  const isEmpty = !isLoading && (!tours || tours.length === 0);

  return (
    <div className="flex-1">
      <TourHeader
        sortBy={currentSort}
        onSortByChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        disabled={isEmpty}
      />

      {!isLoading && tours.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">{t('results_count', { count: tours.length })}</p>
        </div>
      )}

      <div className="grid gap-6">
        {isLoading ? (
          <Loading text={t('searching')} size="md" />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            <div
              className={cn('grid gap-6', {
                'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4': viewMode === 'grid',
                'grid-cols-1': viewMode === 'list',
              })}
            >
              {tours.map(tour => (
                <TourItem key={tour.id} tour={tour} layout={viewMode === 'list' ? 'horizontal' : 'vertical'} />
              ))}
            </div>

            <PaginationClient queryConfig={queryConfig} pageSize={totalPages} range={ITEM_PER_PAGE} showFirstLast />
          </>
        )}
      </div>
    </div>
  );
}
