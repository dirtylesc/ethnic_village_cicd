'use client';

import { BookingGetResponse } from '@/types/booking/booking.response';

import { BookingCalculator } from './booking-calculator';
import GuildProfileCard from './pick-drop-location';

type FloatingBookingPanelProps = {
  booking: BookingGetResponse;
};

const FloatingBookingPanel = ({ booking }: FloatingBookingPanelProps) => {
  return (
    <div className="flex gap-5 xl:w-[360px] xl:flex-shrink-0 xl:flex-col">
      <BookingCalculator booking={booking} />
      <GuildProfileCard location={booking.tour.pickUpLocation} />
    </div>
  );
};

export default FloatingBookingPanel;
