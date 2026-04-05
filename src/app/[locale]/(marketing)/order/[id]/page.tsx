'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { BookingStatus } from '@/core/enum/booking.enum';
import { useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import {
  useApiBookingCancel,
  useApiBookingConfirm,
  useApiBookingGet,
  useApiBookingUpdateContact,
} from '@/hooks/api/useBooking';
import { usePayment } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';
import type { BookingData } from '@/components/features/booking/booking-wizard';
import { BookingWizard, clearBookingState, calculatePromotionPrice } from '@/components/features/booking/booking-wizard';
import { PromotionType } from '@/types/promotion.type';
import { findBestDirectDiscountPromotion } from '@/utils/number';

function OrderPageSkeleton() {
  return (
    <div className="flex h-full w-full flex-col px-4 py-6 md:px-10">
      <div className="mb-5 h-10 w-48 animate-pulse rounded bg-gray-200" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-48 animate-pulse rounded-lg bg-gray-200" />
        </div>
        <div className="hidden w-80 lg:block">
          <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function PaymentExpiredMessage() {
  const t = useTranslations('order');
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">{t('payment_expired_title')}</h2>
        <p className="text-gray-700">{t('payment_expired_message')}</p>
      </div>
    </div>
  );
}

export default function OrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { toast } = useToast();
  const t = useTranslations('order');

  const { data: booking, isLoading, isError } = useApiBookingGet(orderId);
  const { mutateAsync: confirmBooking, isPending: isConfirming } = useApiBookingConfirm(orderId);
  const { mutateAsync: updateContact } = useApiBookingUpdateContact();
  const { createPayment, isCreatingPayment } = usePayment();
  const { mutateAsync: cancelBooking, isPending: isCancelling } = useApiBookingCancel(orderId);

  const isPaymentExpired = useMemo(() => {
    if (!booking?.paymentExpiredDate) return false;
    return new Date() > new Date(booking.paymentExpiredDate);
  }, [booking?.paymentExpiredDate]);

  useEffect(() => {
    if (
      booking &&
      'status' in booking &&
      booking.status === BookingStatus.PENDING_PAYMENT &&
      booking.paymentExpiredDate
    ) {
      router.push(`${RouteConstant.payment}/${orderId}`.replace(':id', orderId));
    }
  }, [booking, router, orderId]);

  const initialBookingData: Partial<BookingData> | undefined = useMemo(() => {
    if (!booking) return undefined;

    const availableSlots =
      booking.tour?.remainingSlots != null
        ? booking.tour.remainingSlots
        : booking.tour?.maxSlots && booking.tour.bookedSlots != null
          ? Math.max(booking.tour.maxSlots - booking.tour.bookedSlots, 0)
          : booking.tour?.maxSlots || 0;

    return {
      tourId: booking.tour.id,
      tourSlug: '',
      tourInfo: booking.tour,
      selectedDateId: null,
      selectedDate: booking.startDate
        ? new Date(booking.startDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '',
      availableSlots,
      guestCount: {
        adult: booking.personCount?.adult || 1,
        child: booking.personCount?.child || 0,
      },
      contactInfo: booking.bookerDetail
        ? {
            name: booking.bookerDetail.name || '',
            email: booking.bookerDetail.email || '',
            phone: booking.bookerDetail.phone || '',
          }
        : null,
      guestInfo: booking.passengerDetail
        ? {
            name: booking.passengerDetail.name || '',
            email: booking.passengerDetail.email || '',
            phone: booking.passengerDetail.phone || '',
          }
        : null,
      bookingType: 'self',
      promotion: (() => {
        const bestPromo = findBestDirectDiscountPromotion(booking.tour.promotions);
        return bestPromo
          ? {
              id: String(bestPromo.id),
              name: bestPromo.name,
              discountPercent: bestPromo.discountPercent,
              maxDiscountAmount: bestPromo.maxDiscountAmount,
            }
          : null;
      })(),
      additionalInfo: booking.additionalInformation || '',
    };
  }, [booking]);

  const handleComplete = useCallback(
    async (bookingData: BookingData) => {
      try {
        if (bookingData.contactInfo) {
          await updateContact({
            id: orderId,
            contactInfo: bookingData.contactInfo,
          });
        }

        const totalPrice =
          bookingData.guestCount.adult * (bookingData.tourInfo?.adultPrice || 0) +
          bookingData.guestCount.child * (bookingData.tourInfo?.childPrice || 0);

        let discountedPrice = totalPrice;
        let promotionId: string | undefined;
        let discountAmount = 0;

        // Use the same logic as BookingSummaryCard to select the active promotion
        const tourPromo = findBestDirectDiscountPromotion(bookingData.tourInfo?.promotions);
        const tourPromoInfo = tourPromo
          ? {
              id: String(tourPromo.id),
              name: tourPromo.name,
              discountPercent: tourPromo.discountPercent,
              maxDiscountAmount: tourPromo.maxDiscountAmount,
            }
          : null;

        let activePromotion = null;
        if (bookingData.promotion && tourPromoInfo) {
          activePromotion = bookingData.promotion.discountPercent >= tourPromoInfo.discountPercent
            ? bookingData.promotion
            : tourPromoInfo;
        } else {
          activePromotion = bookingData.promotion || tourPromoInfo;
        }

        if (activePromotion) {
          const { discountAmount: calculatedDiscount, finalPrice } = calculatePromotionPrice(
            totalPrice,
            activePromotion.discountPercent,
            activePromotion.maxDiscountAmount,
          );
          discountedPrice = finalPrice;
          promotionId = activePromotion.id;
          discountAmount = calculatedDiscount;
        }

        await confirmBooking({
          promotionId,
          discountAmountApplied: discountAmount,
          guestInformation: bookingData.guestInfo || undefined,
          additionalInformation: bookingData.additionalInfo || undefined,
          totalPrice: discountedPrice,
          tourData: bookingData.tourInfo!,
        });

        const paymentData = await createPayment(orderId);

        if (paymentData?.checkoutUrl) {
          clearBookingState();
          window.location.href = paymentData.checkoutUrl;
        } else {
          throw new Error('Cannot create payment link');
        }
      } catch (error) {
        logger.error('Failed to complete booking:', error);
        toast({
          variant: 'destructive',
          title: t('confirm_failed'),
          description: t('confirm_failed_description'),
        });
        throw error;
      }
    },
    [orderId, confirmBooking, createPayment, updateContact, toast, t],
  );

  const handleCancel = useCallback(() => {
    const doCancel = async () => {
      try {
        await cancelBooking();
      } catch (error) {
        logger.error('Failed to cancel booking:', error);
      } finally {
        clearBookingState();
        const redirectUrl = booking?.tour?.slug
          ? RouteConstant.tour_detail.replace(':slug', booking.tour.slug)
          : RouteConstant.tour;
        router.push(redirectUrl);
      }
    };
    doCancel();
  }, [cancelBooking, router, booking?.tour?.slug]);

  if (isLoading) {
    return <OrderPageSkeleton />;
  }

  if (isError || !booking) {
    return notFound();
  }

  if (isPaymentExpired) {
    return <PaymentExpiredMessage />;
  }

  return (
    <div className="flex h-full w-full flex-col px-4 py-6 md:px-10">
      <h1 className="mb-5 text-2xl font-semibold md:text-4xl">{t('title')}</h1>
      <BookingWizard
        initialData={initialBookingData}
        onComplete={handleComplete}
        onCancel={handleCancel}
        showSidePanel={true}
      />
    </div>
  );
}
