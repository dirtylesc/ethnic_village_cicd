'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils/classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { promotionApi } from '@/data/apis/promotion.api';
import logger from '@/libs/logger';

import { clearBookingState, loadBookingState, saveBookingState } from './booking-persistence';
import type { BookingData } from './booking-wizard-context';
import { BOOKING_STEPS, BookingWizardProvider, useBookingWizard } from './booking-wizard-context';
import { BookingSummaryCard } from './components/booking-summary-card';
import type { StepConfig } from './progress-indicator';
import { MobileProgressIndicator, ProgressIndicator } from './progress-indicator';
import { ContactInfoStep } from './steps/contact-info-step';
import { GuestCountStep } from './steps/guest-count-step';
import { GuestInfoStep } from './steps/guest-info-step';
import { ReviewStep } from './steps/review-step';

export type BookingWizardProps = {
  initialData?: Partial<BookingData>;
  onComplete?: (bookingData: BookingData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  showSidePanel?: boolean;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const stepTransition = {
  x: { type: 'spring' as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

type BookingWizardContentProps = {
  onComplete?: (bookingData: BookingData) => Promise<void>;
  onCancel?: () => void;
  showSidePanel?: boolean;
}

function CollapsibleMobileProgress({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: {
  steps: StepConfig[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('booking.wizard');

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm md:hidden">
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MobileProgressIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
        <Button variant="ghost" size="sm" className="ml-2">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t bg-gray-50 px-4 py-4"
          >
            <ProgressIndicator
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={step => {
                onStepClick(step);
                setIsExpanded(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingWizardContent({ onComplete, onCancel, showSidePanel = true }: BookingWizardContentProps) {
  const t = useTranslations('booking.wizard');
  const locale = useLocale() as 'vi' | 'en' | 'ko';
  const { state, actions } = useBookingWizard();
  const { currentStep, completedSteps, bookingData } = state;

  const steps: StepConfig[] = useMemo(
    () => [
      { id: BOOKING_STEPS.GUEST_COUNT, label: t('steps.guest_count') },
      { id: BOOKING_STEPS.CONTACT_INFO, label: t('steps.contact_info') },
      { id: BOOKING_STEPS.GUEST_INFO, label: t('steps.guest_info') },
      { id: BOOKING_STEPS.REVIEW, label: t('steps.review') },
    ],
    [t],
  );

  useEffect(() => {
    const savedState = loadBookingState();
    if (savedState && savedState.bookingData.tourId === bookingData.tourId) {
      actions.goToStep(savedState.currentStep);
      savedState.completedSteps.forEach(step => actions.markStepCompleted(step));
      actions.updateBookingData(savedState.bookingData);
    }
  }, []);

  useEffect(() => {
    const fetchDirectDiscount = async () => {
      if (bookingData.tourId && !bookingData.promotion) {
        try {
          const response = await promotionApi.getBestDirectDiscount(bookingData.tourId);
          if (response.data) {
            actions.updateBookingData({
              promotion: {
                id: response.data.id,
                name: response.data.name,
                discountPercent: response.data.discountPercent,
                maxDiscountAmount: response.data.maxDiscountAmount,
              },
            });
          }
        } catch (error) {

        }
      }
    };

    fetchDirectDiscount();
  }, [bookingData.tourId, bookingData.promotion, actions]);

  useEffect(() => {
    if (bookingData.tourId) {
      saveBookingState(state);
    }
  }, [state, bookingData.tourId]);

  const handleStepClick = useCallback(
    (step: number) => {
      if (completedSteps.has(step) || step < currentStep) {
        actions.goToStep(step);
      }
    },
    [completedSteps, currentStep, actions],
  );

  const handleConfirm = useCallback(async () => {
    if (onComplete) {
      await onComplete(bookingData);
    }
    clearBookingState();
  }, [onComplete, bookingData]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      clearBookingState();
      onCancel();
    }
  }, [onCancel]);

  const direction = useMemo(() => {
    return 1;
  }, []);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case BOOKING_STEPS.GUEST_COUNT:
        return <GuestCountStep key="guest-count" />;
      case BOOKING_STEPS.CONTACT_INFO:
        return <ContactInfoStep key="contact-info" />;
      case BOOKING_STEPS.GUEST_INFO:
        return <GuestInfoStep key="guest-info" />;
      case BOOKING_STEPS.REVIEW:
        return <ReviewStep key="review" onConfirm={handleConfirm} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <CollapsibleMobileProgress
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="hidden px-4 pt-6 md:block lg:px-0">
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          className="mb-8"
        />
      </div>

      <div className="flex flex-col gap-8 px-4 py-6 lg:flex-row lg:px-0">
        <div className="flex-1">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {showSidePanel && currentStep !== BOOKING_STEPS.REVIEW && (
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24">
              <BookingSummaryCard bookingData={bookingData} locale={locale} />
              {onCancel && (
                <Button variant="destructive" className="mt-4 w-full" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  {t('cancel_booking')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function BookingWizard({
  initialData,
  onComplete,
  onCancel,
  className,
  showSidePanel = true,
}: BookingWizardProps) {
  return (
    <BookingWizardProvider initialData={initialData}>
      <div className={cn('w-full', className)}>
        <BookingWizardContent onComplete={onComplete} onCancel={onCancel} showSidePanel={showSidePanel} />
      </div>
    </BookingWizardProvider>
  );
}
