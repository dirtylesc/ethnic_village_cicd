'use client';

import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useBookingStore } from '@/stores/useBookingStore';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useApiBookingStore } from '@/hooks/api/useBooking';
import { useToast } from '@/hooks/use-toast';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './guild-profile-card';

type FloatingBookingPanelProps = {
  tour: Tour;
}

const FloatingBookingPanel = ({ tour }: FloatingBookingPanelProps) => {
  const router = useRouter();
  const { selectedDateId, availableSlots } = useBookingStore();
  const { toast } = useToast();
  const t = useTranslations('tour.detail.booking');
  const storeBooking = useApiBookingStore();

  const handleBook = async (
    tourSlug: string,
    quantities: { adult: number; child: number },
    availableDateId?: string | number,
  ) => {
    try {
      if (!tourSlug || !availableDateId || (!quantities.adult && !quantities.child)) {
        toast({
          title: t('booking_failed'),
          description: t('booking_failed_invalid_data'),
        });
        return;
      }

      if (availableSlots && availableSlots < quantities.adult + quantities.child) {
        toast({
          title: t('booking_failed'),
          description: t('booking_failed_out_of_stock'),
        });
        return;
      }

      const result = await storeBooking.mutateAsync({
        tourSlug: tourSlug,
        availableDateId: String(availableDateId),
        adultCount: Number(quantities.adult),
        childCount: Number(quantities.child),
      });

      if (result) {
        router.push(RouteConstant.order_detail.replace(':id', result.id));
      } else {
        toast({
          title: t('booking_failed'),
          description: t('booking_failed_invalid_data'),
        });
      }
    } catch (error) {
      toast({
        title: t('booking_failed'),
        description: t('booking_failed_invalid_data'),
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 xl:w-[360px] xl:flex-shrink-0">
      <BookingCalculator tour={tour} onBook={handleBook} />
      <GuildProfileCard tour={tour} />
    </div>
  );
};

export default FloatingBookingPanel;
