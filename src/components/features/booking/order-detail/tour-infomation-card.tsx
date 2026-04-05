import { calculateRatingStats } from '@/utils';
import { formatTourDates } from '@/utils/date';
import { useTranslations } from 'next-intl';

import { BookingStoreResponse } from '@/types/booking';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StarRating from '@/components/shared/star-rating';

type TourInformationCardProps = {
  booking: BookingStoreResponse;
};

export default function TourInformationCard({ booking }: TourInformationCardProps) {
  const t = useTranslations('order.tour_info');
  const { startDate, endDate, duration, durationShort } = formatTourDates(booking.startDate, booking.endDate);

  const ratingObj = calculateRatingStats(booking.tour.reviews || []);

  return (
    <Card className="flex flex-col gap-4 bg-primary-5 px-6 py-2">
      <div className="">
        <CardTitle className="text-xl font-semibold">{booking.tour.title}</CardTitle>
        <div className="flex items-center gap-2">
          <b>{t('tour_guide')}:</b> <span>Le Van A</span>
          <b>{t('pickup_location')}:</b> <span>{booking.tour.pickUpLocation.city}</span>
        </div>
      </div>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">{t('review')}</span>
          <StarRating average={ratingObj.average || 0} readOnly />
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">{t('days')}</span>
          <span className="text-base text-dark">
            {booking.tour.duration} {t('days')}
          </span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">{t('location')}</span>
          <span className="text-base text-dark">
            {booking.tour.locations?.map(location => location.city).join(' - ')}
          </span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">{t('adults')}</span>
          <span className="text-base text-dark">{booking.personCount?.adult || 0}</span>
        </div>

        <Separator className="h-[53px]" orientation="vertical" />

        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-gray-500">{t('children')}</span>
          <span className="text-base text-dark">{booking.personCount?.child || 0}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span>{startDate}</span>
        <div className="rounded-lg bg-primary-500 p-2 text-white">{duration}</div>
        <span>{endDate}</span>
      </CardFooter>
    </Card>
  );
}
