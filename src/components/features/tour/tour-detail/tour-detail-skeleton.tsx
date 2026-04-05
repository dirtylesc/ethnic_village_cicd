'use client';

import { Skeleton } from '@/components/ui/skeleton';

const TourDetailHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="h-7 w-3/4 sm:h-9 md:h-[40px]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-14 sm:h-4 sm:w-16" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
          </div>

          <div className="hidden h-[53px] w-[1px] bg-gray-200 sm:block" />

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-14 sm:h-4 sm:w-16" />
            <Skeleton className="h-4 w-20 sm:w-24" />
          </div>

          <div className="hidden h-[53px] w-[1px] bg-gray-200 sm:block" />

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-14 sm:h-4 sm:w-16" />
            <Skeleton className="h-4 w-20 sm:w-24" />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <Skeleton className="h-[38px] w-[38px]" />
          <Skeleton className="h-[38px] w-[38px] sm:w-[100px]" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-3 overflow-x-auto sm:gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-[70px] w-[100px] flex-shrink-0 sm:h-[80px] sm:w-[120px]" />
          ))}
        </div>
      </div>
    </div>
  );
};

const TourDetailContentSkeleton = () => {
  return (
    <div className="w-full">
      <div className="relative mb-5 border-b border-gray-200 pb-3 sm:mb-[30px]">
        <div className="flex gap-5 sm:gap-[30px]">
          <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
          <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
        </div>
        <div className="absolute bottom-0 left-0 h-[3px] w-[70px] bg-primary sm:w-[84px]" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Skeleton className="h-32 w-full sm:h-40" />
        <div className="grid gap-3 sm:gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full sm:h-20" />
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingCalculatorSkeleton = () => {
  return (
    <div className="grid gap-4 rounded-[20px] border border-gray-20 bg-white p-5 shadow-custom-gray sm:p-[30px] xl:w-[360px] xl:flex-shrink-0">
      <Skeleton className="h-7 w-full sm:h-8" />
      <Skeleton className="mx-auto h-4 w-3/4" />

      <div className="h-[1px] bg-gray-200" />

      {[1, 2].map(i => (
        <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <Skeleton className="h-5 w-20 sm:h-6 sm:w-24" />
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14" />
          <Skeleton className="h-5 w-14 sm:h-6 sm:w-16" />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 sm:h-6 sm:w-20" />
        <Skeleton className="h-5 w-20 sm:h-6 sm:w-24" />
      </div>

      <Skeleton className="h-11 w-full sm:h-[52px]" />
    </div>
  );
};

export const TourDetailSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]" />
      <div className="flex flex-col pt-4 sm:pt-6">
        <div className="flex flex-col-reverse gap-6 pb-10 sm:gap-8 sm:pb-[60px] lg:gap-10 xl:flex-row">
          <div className="w-full space-y-6 sm:space-y-8 lg:space-y-10 xl:max-w-[calc(100%-360px-40px)]">
            <TourDetailHeaderSkeleton />
            <TourDetailContentSkeleton />
          </div>
          <BookingCalculatorSkeleton />
        </div>
      </div>
    </div>
  );
};
