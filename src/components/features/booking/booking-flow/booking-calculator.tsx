'use client';

import { useMemo, useState } from 'react';
import { useBookingStore } from '@/stores/useBookingStore';
import { applyPromotionToTotal, calculateTotalPrice, calculateTotalPriceWithPromotion, formatCurrency } from '@/utils';
import { cn } from '@/utils/classnames';
import { useLocale, useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import { BookingGetResponse } from '@/types/booking/booking.response';
import { PromotionValidateResponse } from '@/types/promotion.type';
import { useApiBookingConfirm } from '@/hooks/api/useBooking';
import { usePayment } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import PromotionValidationForm from './promotion-validation-form';

type PersonTypeCalculatorProps = {
  label: string;
  price: number;
  value: number;
  locale: 'vi' | 'en' | 'ko';
  onChange: (value: number) => void;
}

const PersonTypeCalculator = ({ label, price, value, locale }: PersonTypeCalculatorProps) => {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <span className="text-dark-900 text-base font-bold">{label}</span>
      <p className="border-gray-20 text-center text-base">{value} x </p>
      <span className="text-dark-900 whitespace-nowrap text-base">
        {formatCurrency(price, {
          locale: locale,
        })}
      </span>
    </div>
  );
};

type BookingCalculatorProps = {
  booking: BookingGetResponse;
}

export const BookingCalculator = ({ booking }: BookingCalculatorProps) => {
  const t = useTranslations('order');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { toast } = useToast();

  const [quantities, setQuantities] = useState({
    adult: booking.personCount?.adult || 0,
    child: booking.personCount?.child || 0,
  });
  const [promotion, setPromotion] = useState<PromotionValidateResponse | null>(null);
  const { mutateAsync: confirmBooking } = useApiBookingConfirm(booking.id);
  const { createPayment } = usePayment();
  const { contactInfo, guestInfo, additionalInfo } = useBookingStore();

  const totalPrice = useMemo(() => calculateTotalPrice(quantities, booking.tour), [quantities, booking.tour]);

  const discountedPrice = useMemo(() => {
    if (promotion) {
      return applyPromotionToTotal(totalPrice, promotion);
    }

    if (booking.tour.promotions?.length) {
      return calculateTotalPriceWithPromotion(quantities, booking.tour);
    }

    return totalPrice;
  }, [totalPrice, promotion, quantities, booking.tour]);

  const handleQuantityChange = (type: keyof typeof quantities) => (value: number) => {
    setQuantities(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleBookNow = async () => {
    try {
      if (!contactInfo) {
        toast({
          variant: 'destructive',
          title: t('booking_calculator.contact_info_required'),
        });
        return;
      }

      if (!guestInfo) {
        toast({
          variant: 'destructive',
          title: t('booking_calculator.guest_info_required'),
        });
        return;
      }

      await confirmBooking({
        promotionId: promotion?.id,
        discountAmountApplied: totalPrice - discountedPrice,
        guestInformation: guestInfo,
        additionalInformation: additionalInfo,
        totalPrice: discountedPrice,
        tourData: booking.tour,
      });

      const paymentData = await createPayment(booking.id);

      if (paymentData?.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        logger.error('Invalid payment data:', paymentData);
        throw new Error('Không thể tạo link thanh toán');
      }
    } catch (error) {
      logger.error('Failed to confirm booking:', error);
      toast({
        variant: 'destructive',
        title: t('booking_calculator.confirm_failed'),
      });
    }
  };

  return (
    <div className="xl:flex-0 grid gap-4 rounded-[20px] border border-gray-20 bg-white p-[30px] shadow-custom-gray lg:w-[360px]">
      <div className="text-dark-900 flex flex-col text-center text-[30px] font-bold leading-[1.17]">
        {discountedPrice === totalPrice ? (
          <span className="text-dark-900 text-[30px] font-bold">{formatCurrency(totalPrice, { locale })}</span>
        ) : (
          <>
            <span className="text-base font-semibold tracking-wide text-gray-500 line-through">
              {formatCurrency(totalPrice, { locale })}
            </span>
            <span className="text-dark-900 text-[30px] font-bold">{formatCurrency(discountedPrice, { locale })}</span>
          </>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-5">
        <PersonTypeCalculator
          label={t('booking_calculator.adult')}
          price={booking.tour.adultPrice}
          value={quantities.adult}
          onChange={handleQuantityChange('adult')}
          locale={locale}
        />
        <PersonTypeCalculator
          label={t('booking_calculator.children')}
          price={booking.tour.childPrice}
          value={quantities.child}
          onChange={handleQuantityChange('child')}
          locale={locale}
        />
        {!booking?.tour?.promotions?.length && (
          <PromotionValidationForm promotion={promotion} booking={booking} setPromotion={setPromotion} />
        )}
      </div>

      <Button
        onClick={handleBookNow}
        className={cn(
          'hover:bg-primary/90 h-auto w-full bg-primary-button py-3 text-white',
          'text-base font-normal leading-[1.625]',
        )}
      >
        {t('booking_calculator.book_now')}
      </Button>
    </div>
  );
};
