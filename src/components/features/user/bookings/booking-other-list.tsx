import { useMemo } from 'react';
import Link from 'next/link';
import { BookingStatus } from '@/core/enum/booking.enum';
import { Receipt, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useApiBookingList } from '@/hooks/api/useBooking';
import { useQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import PaginationClient from '@/components/shared/pagination-client';

import BookingCard from './booking-card';
import { TABS } from './booking-tab';

const BookingCardSkeleton = ({ index }: { index: number }) => (
  <div
    className="relative overflow-hidden rounded-lg border border-border bg-card"
    style={{
      animationDelay: `${index * 100}ms`,
    }}
  >
    <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-pulse" />

    <div className="flex flex-col lg:flex-row">
      <div className="relative h-44 w-full flex-shrink-0 overflow-hidden lg:h-auto lg:w-52">
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-muted via-muted/50 to-muted" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded-md bg-muted/70" />
          </div>
          <div className="h-7 w-24 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-2">
              <div className="h-7 w-7 animate-pulse rounded-md bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-10 animate-pulse rounded bg-muted" />
                <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />
          <div className="flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>
);

const EmptyState = () => {
  const t = useTranslations('personal.booking_other_list');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green/10">
          <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-md">
            <CheckCircle2 className="h-4 w-4 text-green" />
          </div>
          <Receipt className="h-10 w-10 text-green" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="mb-2 text-center text-lg font-bold text-foreground">
        {t('empty_title') || 'No transactions yet'}
      </h3>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {t('empty_description') || 'Completed, confirmed, or cancelled transactions will appear here.'}
      </p>

      <Button asChild className="mt-6 bg-green text-white hover:bg-green/90" variant="default">
        <Link href="/tour">
          <Receipt className="mr-2 h-4 w-4" />
          <span>{t('explore_tours') || 'Explore tours'}</span>
        </Link>
      </Button>
    </div>
  );
};

const ErrorState = () => {
  const t = useTranslations('personal.booking_other_list');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <RefreshCw className="h-10 w-10 text-destructive" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="mb-2 text-center text-lg font-bold text-foreground">
        {t('error_title') || 'Something went wrong'}
      </h3>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {t('error_description') || 'Unable to load transactions. Please try again.'}
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
      >
        <RefreshCw className="h-4 w-4" />
        <span>{t('retry') || 'Try again'}</span>
      </button>
    </div>
  );
};

export default function BookingOtherList() {
  const t = useTranslations('personal.booking_other_list');
  const queryConfig = useQueryConfig();

  const request = useMemo(() => {
    return {
      bookingTab: TABS.OTHERS,
      status: queryConfig.status?.length ? queryConfig.status : Object.values(BookingStatus),
      start_date: queryConfig.start_date,
      end_date: queryConfig.end_date,
      sortBy: queryConfig.sort_by || 'bookingDate',
      order: queryConfig.order || 'desc',
      page: queryConfig.page || 1,
      size: 10,
    };
  }, [queryConfig]);

  const { data, isLoading, isError } = useApiBookingList(request as BookingListRequest);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <BookingCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!data || data.content.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {data.content.map((booking, index) => (
        <BookingCard key={booking.id} booking={booking} index={index} />
      ))}
      {data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <PaginationClient queryConfig={{ page: request.page }} pageSize={data.totalPages} />
        </div>
      )}
    </div>
  );
}
