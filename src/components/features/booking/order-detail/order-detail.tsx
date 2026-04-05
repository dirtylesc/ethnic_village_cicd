'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { BookingStatus } from '@/core/enum/booking.enum';
import { useBookingStore } from '@/stores/useBookingStore';
import logger from '@/libs/logger';

import { useApiBookingGet } from '@/hooks/api/useBooking';

import AdditionalInformationCard from './additional_information_card';
import ContactInformationCard from './contact-information-card';
import FloatingBookingPanel from './floating-booking-panel';
import GuestInformationCard from './guest-information-card';
import TourInformationCard from './tour-infomation-card';

export function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { data: booking, isLoading, isError } = useApiBookingGet(orderId);
  const { setGuestInfo, setContactInfo } = useBookingStore();
  const [paymentExpired, setPaymentExpired] = useState(false);

  useEffect(() => {
    if (booking?.bookerDetail) {
      setContactInfo({
        name: booking.bookerDetail.name,
        email: booking.bookerDetail.email,
        phone: booking.bookerDetail.phone,
      });
    }

    if (
      booking &&
      'status' in booking &&
      booking.status === BookingStatus.PENDING_PAYMENT &&
      booking.paymentExpiredDate
    ) {
      router.push(`${RouteConstant.payment}/${orderId}`);
      return;
    }

    if (booking?.paymentExpiredDate) {
      const currentDate = new Date();
      const paymentExpiredDate = new Date(booking.paymentExpiredDate);

      if (currentDate > paymentExpiredDate) {
        setPaymentExpired(true);
      }
    }
  }, [booking, setContactInfo, router, orderId]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    logger.error('Failed to fetch booking');
    return notFound();
  }

  if (!booking) {
    return notFound();
  }

  if (paymentExpired) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Booking Payment Expired</h2>
          <p className="text-gray-700">
            The payment period for this booking has expired. Please contact support or create a new booking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <div className="flex flex-1 flex-col gap-5">
        <TourInformationCard booking={booking} />
        <ContactInformationCard booking={booking} />
        <GuestInformationCard booking={booking} />
        <AdditionalInformationCard booking={booking} />
      </div>
      <FloatingBookingPanel booking={booking} />
    </div>
  );
}
