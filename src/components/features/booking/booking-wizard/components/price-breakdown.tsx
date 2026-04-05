'use client';

import { useMemo } from 'react';
import { formatCurrency, findBestDirectDiscountPromotion } from '@/utils/number';
import { Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { Promotion } from '@/types/promotion.type';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { GuestCount, PromotionInfo } from '../booking-wizard-context';

export type PriceBreakdownProps = {
  guestCount: GuestCount;
  adultPrice: number;
  childPrice: number;
  promotion: PromotionInfo | null;
  tourPromotion?: Promotion;
  locale: 'vi' | 'en' | 'ko';
}

export function calculatePromotionPrice(
  originalPrice: number,
  discountPercent: number,
  maxDiscountAmount: number | undefined | null,
): { discountAmount: number; finalPrice: number } {
  if (!discountPercent || originalPrice <= 0) {
    return { discountAmount: 0, finalPrice: originalPrice };
  }

  const rawDiscount = (originalPrice * discountPercent) / 100;
  const discountAmount = maxDiscountAmount !== undefined && maxDiscountAmount !== null
    ? Math.min(rawDiscount, maxDiscountAmount)
    : rawDiscount;
  const finalPrice = Math.max(originalPrice - discountAmount, 0);

  return { discountAmount, finalPrice };
}

export function PriceBreakdown({
  guestCount,
  adultPrice,
  childPrice,
  promotion,
  tourPromotion,
  locale,
}: PriceBreakdownProps) {
  const t = useTranslations('booking.wizard.price_breakdown');

  const priceDetails = useMemo(() => {
    const adultTotal = guestCount.adult * adultPrice;
    const childTotal = guestCount.child * childPrice;
    const originalPrice = adultTotal + childTotal;

    const tourPromoInfo = tourPromotion
      ? {
          id: String(tourPromotion.id),
          name: tourPromotion.name,
          discountPercent: tourPromotion.discountPercent,
          maxDiscountAmount: tourPromotion.maxDiscountAmount,
        }
      : null;

    const activePromotion =
      promotion && tourPromoInfo
        ? promotion.discountPercent >= tourPromoInfo.discountPercent
          ? promotion
          : tourPromoInfo
        : promotion || tourPromoInfo;

    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (activePromotion) {
      const result = calculatePromotionPrice(
        originalPrice,
        activePromotion.discountPercent,
        activePromotion.maxDiscountAmount,
      );
      discountAmount = result.discountAmount;
      finalPrice = result.finalPrice;
    }

    return {
      adultTotal,
      childTotal,
      originalPrice,
      discountAmount,
      finalPrice,
      activePromotion,
    };
  }, [guestCount, adultPrice, childPrice, promotion, tourPromotion]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 font-semibold">{t('title')}</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t('adults')} ({guestCount.adult} x {formatCurrency(adultPrice, { locale })})
            </span>
            <span>{formatCurrency(priceDetails.adultTotal, { locale })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t('children')} ({guestCount.child} x {formatCurrency(childPrice, { locale })})
            </span>
            <span>{formatCurrency(priceDetails.childTotal, { locale })}</span>
          </div>

          {priceDetails.activePromotion && priceDetails.discountAmount > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('subtotal')}</span>
                <span>{formatCurrency(priceDetails.originalPrice, { locale })}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {priceDetails.activePromotion.name} (-{priceDetails.activePromotion.discountPercent}%)
                </span>
                <span>-{formatCurrency(priceDetails.discountAmount, { locale })}</span>
              </div>
            </>
          )}

          <Separator />
          <div className="flex justify-between">
            <span className="text-lg font-semibold">{t('total')}</span>
            <div className="text-right">
              {priceDetails.discountAmount > 0 && (
                <span className="mr-2 text-sm text-gray-400 line-through">
                  {formatCurrency(priceDetails.originalPrice, { locale })}
                </span>
              )}
              <span className="text-xl font-bold text-primary">
                {formatCurrency(priceDetails.finalPrice, { locale })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
