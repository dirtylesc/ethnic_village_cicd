'use client';

import { useCallback, useState, useMemo } from 'react';
import { AlertCircle, Calendar, Edit2, Mail, Phone, User, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { findBestDirectDiscountPromotion } from '@/utils/number';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { BookingData } from '../booking-wizard-context';
import { BOOKING_STEPS, useBookingWizard } from '../booking-wizard-context';
import { PriceBreakdown } from '../components/price-breakdown';
import { PromotionCodeInput } from '../components/promotion-code-input';
import { WizardNavigation } from '../wizard-navigation';

export type ReviewStepProps = {
  onBack?: () => void;
  onConfirm?: () => Promise<void>;
}

type SectionHeaderProps = {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  editLabel: string;
}

function SectionHeader({ title, icon, onEdit, editLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1 text-primary">
        <Edit2 className="h-4 w-4" />
        {editLabel}
      </Button>
    </div>
  );
}

export function checkReviewSummaryCompleteness(bookingData: BookingData): {
  isComplete: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];

  if (!bookingData.tourInfo?.title) missingFields.push('tourName');
  if (!bookingData.selectedDate) missingFields.push('selectedDate');
  if (bookingData.guestCount.adult + bookingData.guestCount.child === 0) missingFields.push('guestCount');
  if (!bookingData.contactInfo?.name || !bookingData.contactInfo?.email || !bookingData.contactInfo?.phone) {
    missingFields.push('contactInfo');
  }
  if (!bookingData.guestInfo?.name || !bookingData.guestInfo?.email || !bookingData.guestInfo?.phone) {
    missingFields.push('guestInfo');
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

export function getStepIndexForSection(section: 'guestCount' | 'contactInfo' | 'guestInfo'): number {
  const sectionToStep: Record<string, number> = {
    guestCount: BOOKING_STEPS.GUEST_COUNT,
    contactInfo: BOOKING_STEPS.CONTACT_INFO,
    guestInfo: BOOKING_STEPS.GUEST_INFO,
  };
  return sectionToStep[section];
}

export function ReviewStep({ onBack, onConfirm }: ReviewStepProps) {
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const t = useTranslations('booking.wizard.review');
  const { state, actions } = useBookingWizard();
  const { bookingData, isLoading } = state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const tourInfo = bookingData.tourInfo;
  const adultPrice = tourInfo?.adultPrice || 0;
  const childPrice = tourInfo?.childPrice || 0;
  const bestTourPromotion = useMemo(() => findBestDirectDiscountPromotion(tourInfo?.promotions), [tourInfo?.promotions]);
  const hasActivePromotion = !!bestTourPromotion;

  const handleEditSection = useCallback(
    (step: number) => {
      actions.goToStep(step);
    },
    [actions],
  );

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      actions.prevStep();
    }
  }, [actions, onBack]);

  const handleConfirm = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    actions.setLoading(true);

    try {
      if (onConfirm) {
        await onConfirm();
      }
      actions.markStepCompleted(BOOKING_STEPS.REVIEW);
    } catch {
      setSubmitError(t('payment_failed'));
    } finally {
      setIsSubmitting(false);
      actions.setLoading(false);
    }
  }, [actions, onConfirm, t]);

  const totalGuests = bookingData.guestCount.adult + bookingData.guestCount.child;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{tourInfo?.title || t('tour_info')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <SectionHeader
              title={t('guest_count_section')}
              icon={<Users className="h-5 w-5 text-gray-500" />}
              onEdit={() => handleEditSection(BOOKING_STEPS.GUEST_COUNT)}
              editLabel={t('edit')}
            />
            <div className="mt-3 space-y-2 pl-7">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('date')}: <strong>{bookingData.selectedDate || '-'}</strong>
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {t('adults')}: <strong>{bookingData.guestCount.adult}</strong>
              </div>
              <div className="text-sm text-gray-600">
                {t('children')}: <strong>{bookingData.guestCount.child}</strong>
              </div>
              <div className="text-sm text-gray-600">
                {t('total_guests')}: <strong>{totalGuests}</strong>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <SectionHeader
              title={t('contact_info_section')}
              icon={<User className="h-5 w-5 text-gray-500" />}
              onEdit={() => handleEditSection(BOOKING_STEPS.CONTACT_INFO)}
              editLabel={t('edit')}
            />
            <div className="mt-3 space-y-2 pl-7">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{bookingData.contactInfo?.name || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{bookingData.contactInfo?.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{bookingData.contactInfo?.phone || '-'}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <SectionHeader
              title={t('guest_info_section')}
              icon={<Users className="h-5 w-5 text-gray-500" />}
              onEdit={() => handleEditSection(BOOKING_STEPS.GUEST_INFO)}
              editLabel={t('edit')}
            />
            <div className="mt-3 space-y-2 pl-7">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{bookingData.guestInfo?.name || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{bookingData.guestInfo?.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{bookingData.guestInfo?.phone || '-'}</span>
              </div>
              {bookingData.bookingType === 'self' && (
                <div className="text-xs italic text-gray-400">{t('same_as_contact')}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasActivePromotion && <PromotionCodeInput tourId={bookingData.tourId} />}

      <PriceBreakdown
        guestCount={bookingData.guestCount}
        adultPrice={adultPrice}
        childPrice={childPrice}
        promotion={bookingData.promotion}
        tourPromotion={bestTourPromotion || undefined}
        locale={locale}
      />

      {submitError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{submitError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirm}
              className="mt-2"
              disabled={isSubmitting || isLoading}
            >
              {t('retry')}
            </Button>
          </div>
        </div>
      )}

      <WizardNavigation
        showBack={true}
        onBack={handleBack}
        onContinue={handleConfirm}
        continueLabel={t('confirm_and_pay')}
        isContinueDisabled={isSubmitting || isLoading}
        isLoading={isSubmitting || isLoading}
      />
    </div>
  );
}
