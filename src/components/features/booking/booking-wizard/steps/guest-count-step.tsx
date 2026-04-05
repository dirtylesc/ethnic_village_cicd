'use client';

import { useCallback, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { formatCurrency, findBestDirectDiscountPromotion } from '@/utils/number';
import { AlertCircle, BadgePercent, Calendar, Minus, Plus, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { BOOKING_STEPS, useBookingWizard } from '../booking-wizard-context';
import { calculatePromotionPrice } from '../components/price-breakdown';
import { WizardNavigation } from '../wizard-navigation';

export type GuestCountStepProps = {
  onNext?: () => void;
};

export function calculateTotalPriceForWizard(
  guestCount: { adult: number; child: number },
  adultPrice: number,
  childPrice: number,
  promotion?: { discountPercent: number; maxDiscountAmount: number } | null,
): { originalPrice: number; discountedPrice: number; discountAmount: number } {
  const originalPrice = guestCount.adult * adultPrice + guestCount.child * childPrice;

  if (!promotion || !promotion.discountPercent) {
    return { originalPrice, discountedPrice: originalPrice, discountAmount: 0 };
  }

  const { discountAmount, finalPrice } = calculatePromotionPrice(
    originalPrice,
    promotion.discountPercent,
    promotion.maxDiscountAmount,
  );

  return { originalPrice, discountedPrice: finalPrice, discountAmount };
}

export function validateGuestCount(
  guestCount: { adult: number; child: number },
  availableSlots: number,
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const totalGuests = guestCount.adult + guestCount.child;

  if (totalGuests === 0) {
    errors.push('guest_count_zero');
  }

  if (totalGuests > availableSlots) {
    errors.push('exceeds_available_slots');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

type GuestCounterProps = {
  label: string;
  price: number;
  value: number;
  locale: 'vi' | 'en' | 'ko';
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

function GuestCounter({ label, price, value, locale, onChange, min = 0, max = 99, disabled }: GuestCounterProps) {
  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col">
        <span className="text-base font-semibold text-gray-900">{label}</span>
        <span className="text-sm text-gray-500">
          {formatCurrency(price, { locale })}/{useTranslations('booking.wizard.guest_count')('per_person')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-lg font-semibold">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function GuestCountStep({ onNext }: GuestCountStepProps) {
  const t = useTranslations('booking.wizard.guest_count');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { state, actions } = useBookingWizard();
  const { bookingData, isLoading, validationErrors } = state;

  const tourInfo = bookingData.tourInfo;
  const adultPrice = tourInfo?.adultPrice || 0;
  const childPrice = tourInfo?.childPrice || 0;
  const availableSlots = bookingData.availableSlots || 0;
  const effectiveSlots = availableSlots > 0 ? availableSlots : Number.MAX_SAFE_INTEGER;

  const bestTourPromotion = findBestDirectDiscountPromotion(tourInfo?.promotions);
  const tourPromotionInfo = bestTourPromotion
    ? {
        id: String(bestTourPromotion.id),
        name: bestTourPromotion.name,
        discountPercent: bestTourPromotion.discountPercent,
        maxDiscountAmount: bestTourPromotion.maxDiscountAmount,
      }
    : null;

  const promotion = useMemo(() => {
    if (bookingData.promotion && tourPromotionInfo) {
      return bookingData.promotion.discountPercent >= tourPromotionInfo.discountPercent
        ? bookingData.promotion
        : tourPromotionInfo;
    }
    return bookingData.promotion || tourPromotionInfo;
  }, [bookingData.promotion, tourPromotionInfo]);

  const { originalPrice, discountedPrice, discountAmount } = useMemo(
    () => {
      const result = calculateTotalPriceForWizard(
        bookingData.guestCount,
        adultPrice,
        childPrice,
        promotion
          ? { discountPercent: promotion.discountPercent, maxDiscountAmount: promotion.maxDiscountAmount || 0 }
          : null,
      );
      return result;
    },
    [bookingData.guestCount, adultPrice, childPrice, promotion],
  );

  const validation = useMemo(
    () => validateGuestCount(bookingData.guestCount, effectiveSlots),
    [bookingData.guestCount, effectiveSlots],
  );

  const handleAdultChange = useCallback(
    (value: number) => {
      actions.updateBookingData({
        guestCount: { ...bookingData.guestCount, adult: value },
      });
      actions.setValidationErrors(BOOKING_STEPS.GUEST_COUNT, []);
    },
    [actions, bookingData.guestCount],
  );

  const handleChildChange = useCallback(
    (value: number) => {
      actions.updateBookingData({
        guestCount: { ...bookingData.guestCount, child: value },
      });
      actions.setValidationErrors(BOOKING_STEPS.GUEST_COUNT, []);
    },
    [actions, bookingData.guestCount],
  );

  const handleContinue = useCallback(() => {
    const { isValid, errors } = validateGuestCount(bookingData.guestCount, effectiveSlots);

    if (!isValid) {
      actions.setValidationErrors(BOOKING_STEPS.GUEST_COUNT, errors);
      return;
    }

    actions.markStepCompleted(BOOKING_STEPS.GUEST_COUNT);
    if (onNext) {
      onNext();
    } else {
      actions.nextStep();
    }
  }, [bookingData.guestCount, effectiveSlots, actions, onNext]);

  const totalGuests = bookingData.guestCount.adult + bookingData.guestCount.child;
  const stepErrors = validationErrors[BOOKING_STEPS.GUEST_COUNT] || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">
              {t('selected_date')}: <strong>{bookingData.selectedDate || t('no_date_selected')}</strong>
            </span>
          </div>

          {availableSlots > 0 && (
            <div className="mb-4 flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">
                {t('available_slots')}: <strong>{availableSlots}</strong>
              </span>
            </div>
          )}

          <Separator className="my-4" />

          <div className="space-y-2">
            <GuestCounter
              label={t('adult')}
              price={adultPrice}
              value={bookingData.guestCount.adult}
              locale={locale}
              onChange={handleAdultChange}
              min={0}
              max={effectiveSlots}
              disabled={isLoading}
            />
            <Separator />
            <GuestCounter
              label={t('child')}
              price={childPrice}
              value={bookingData.guestCount.child}
              locale={locale}
              onChange={handleChildChange}
              min={0}
              max={effectiveSlots - bookingData.guestCount.adult}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {stepErrors.length > 0 && (
        <div className={cn('flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4')}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <div className="text-sm text-red-700">
            {stepErrors.map(error => (
              <div key={error}>
                {t(`errors.${error}` as 'errors.guest_count_zero' | 'errors.exceeds_available_slots')}
              </div>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('adult')} ({bookingData.guestCount.adult} x {formatCurrency(adultPrice, { locale })})
              </span>
              <span>{formatCurrency(bookingData.guestCount.adult * adultPrice, { locale })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {t('child')} ({bookingData.guestCount.child} x {formatCurrency(childPrice, { locale })})
              </span>
              <span>{formatCurrency(bookingData.guestCount.child * childPrice, { locale })}</span>
            </div>

            {discountAmount > 0 && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-sm text-green-600">
                  <div className="flex items-center gap-1.5">
                    <BadgePercent className="h-4 w-4" />
                    <span>
                      {t('discount')} ({promotion?.discountPercent}%)
                    </span>
                    {bookingData.promotion && (
                      <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {t('auto_applied')}
                      </span>
                    )}
                  </div>
                  <span>-{formatCurrency(discountAmount, { locale })}</span>
                </div>
              </>
            )}

            <Separator />
            <div className="flex justify-between">
              <span className="text-lg font-semibold">{t('total')}</span>
              <div className="text-right">
                {discountAmount > 0 && (
                  <span className="mr-2 text-sm text-gray-400 line-through">
                    {formatCurrency(originalPrice, { locale })}
                  </span>
                )}
                <span className="text-xl font-bold text-primary">{formatCurrency(discountedPrice, { locale })}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <WizardNavigation
        showBack={false}
        onContinue={handleContinue}
        isContinueDisabled={!validation.isValid || totalGuests === 0}
        isLoading={isLoading}
      />
    </div>
  );
}
