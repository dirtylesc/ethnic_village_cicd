'use client';

import { useMemo } from 'react';
import { formatCurrency, findBestDirectDiscountPromotion } from '@/utils/number';
import { Calendar, MapPin, Tag, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { BookingData, GuestCount, PromotionInfo } from '../booking-wizard-context';
import { calculatePromotionPrice } from './price-breakdown';

export type BookingSummaryCardProps = {
  bookingData: BookingData;
  locale: 'vi' | 'en' | 'ko';
  className?: string;
};

function calculateSummaryPrice(
  guestCount: GuestCount,
  adultPrice: number,
  childPrice: number,
  promotion: PromotionInfo | null,
) {
  const adultTotal = guestCount.adult * adultPrice;
  const childTotal = guestCount.child * childPrice;
  const originalPrice = adultTotal + childTotal;

  if (!promotion) {
    return { originalPrice, discountAmount: 0, finalPrice: originalPrice };
  }

  const { discountAmount, finalPrice } = calculatePromotionPrice(
    originalPrice,
    promotion.discountPercent,
    promotion.maxDiscountAmount,
  );

  return { originalPrice, discountAmount, finalPrice };
}

export function BookingSummaryCard({ bookingData, locale, className }: BookingSummaryCardProps) {
  const t = useTranslations('booking.wizard.summary');

  const tourInfo = bookingData.tourInfo;
  const adultPrice = tourInfo?.adultPrice || 0;
  const childPrice = tourInfo?.childPrice || 0;

  const activePromotion = useMemo(() => {
    const tourPromo = findBestDirectDiscountPromotion(tourInfo?.promotions);
    const tourPromoInfo = tourPromo
      ? {
          id: String(tourPromo.id),
          name: tourPromo.name,
          discountPercent: tourPromo.discountPercent,
          maxDiscountAmount: tourPromo.maxDiscountAmount,
        }
      : null;

    if (bookingData.promotion && tourPromoInfo) {
      return bookingData.promotion.discountPercent >= tourPromoInfo.discountPercent
        ? bookingData.promotion
        : tourPromoInfo;
    }
    return bookingData.promotion || tourPromoInfo;
  }, [bookingData.promotion, tourInfo?.promotions]);

  const priceDetails = useMemo(() => {
    const result = calculateSummaryPrice(bookingData.guestCount, adultPrice, childPrice, activePromotion);
    return result;
  }, [bookingData.guestCount, adultPrice, childPrice, activePromotion]);

  const totalGuests = bookingData.guestCount.adult + bookingData.guestCount.child;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tourInfo && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">{tourInfo.title}</h3>
            {tourInfo.locations && tourInfo.locations.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{tourInfo.locations.map(loc => loc.city).join(', ')}</span>
              </div>
            )}
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{t('date')}</span>
            </div>
            <span className="font-medium">{bookingData.selectedDate || t('not_selected')}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{t('guests')}</span>
            </div>
            <span className="font-medium">{totalGuests}</span>
          </div>

          <div className="ml-6 space-y-1 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>{t('adults')}</span>
              <span>{bookingData.guestCount.adult}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('children')}</span>
              <span>{bookingData.guestCount.child}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span>{formatCurrency(priceDetails.originalPrice, { locale })}</span>
          </div>

          {activePromotion && priceDetails.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                {t('discount')} ({activePromotion.discountPercent}%)
              </span>
              <span>-{formatCurrency(priceDetails.discountAmount, { locale })}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between">
            <span className="font-semibold">{t('total')}</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(priceDetails.finalPrice, { locale })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
