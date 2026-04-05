'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { tourApi } from '@/data/apis/tour.api';
import { useQuery } from '@tanstack/react-query';

import { Tour } from '@/types/tour.type';
import { useTourDetail, TOUR_QUERY_KEY } from '@/hooks/api/useTour';

import FloatingBookingPanel from './floating-booking-panel';
import SimilarTrip from './similar-trip';
import { TourDetailContent } from './tour-detail-content';
import TourDetailHeader from './tour-detail-header';
import { TourDetailSkeleton } from './tour-detail-skeleton';

type TourDetailProps = {
  slug: string;
  initialTour?: Tour;
}

const TourDetail = ({ slug, initialTour }: TourDetailProps) => {
  const { data: response, isLoading, isError } = useTourDetail(slug, {
    initialData: initialTour ? { data: initialTour, code: 200, success: true, message: '' } : undefined,
    refetchOnMount: initialTour ? false : undefined,
    refetchOnWindowFocus: false,
    staleTime: initialTour ? Infinity : undefined,
    gcTime: initialTour ? Infinity : undefined,
  });
  const tour = response?.data || initialTour;

  const { data: similarToursResponse } = useQuery({
    queryKey: ['similar-tours', tour?.slug],
    queryFn: async () => {
      if (!tour?.slug) return [];
      const response = await tourApi.getSimilarTours(tour.slug, 4);
      return response.data || [];
    },
    enabled: !!tour?.slug,
  });

  if (isLoading && !initialTour) {
    return <TourDetailSkeleton />;
  }

  if (isError || !tour) {
    return notFound();
  }

  return (
    <div>
      <div className="full-bleed relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={tour.imageUrl}
          alt={tour.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      <div className="flex flex-col pt-4 sm:pt-6">
        <div className="flex flex-col-reverse gap-6 pb-10 sm:gap-8 sm:pb-[60px] lg:gap-10 xl:flex-row">
          <div className="w-full space-y-6 sm:space-y-8 lg:space-y-10 xl:max-w-[calc(100%-360px-40px)]">
            <TourDetailHeader {...tour} />
            <TourDetailContent tour={tour} />
          </div>
          <FloatingBookingPanel tour={tour} />
        </div>
        <SimilarTrip tours={similarToursResponse || []} />
      </div>
    </div>
  );
};

export default TourDetail;
