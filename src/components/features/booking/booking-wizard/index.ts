export { BookingWizard } from './booking-wizard';
export type { BookingWizardProps } from './booking-wizard';

export {
  BOOKING_STEPS,
  BookingWizardProvider,
  TOTAL_STEPS,
  useBookingWizard,
  useBookingWizardActions,
  useBookingWizardState,
} from './booking-wizard-context';

export type {
  BookingData,
  BookingWizardActions,
  BookingWizardState,
  ContactInfo,
  GuestCount,
  GuestInfo,
  PromotionInfo,
} from './booking-wizard-context';

export { MobileProgressIndicator, ProgressIndicator } from './progress-indicator';
export type { ProgressIndicatorProps, StepConfig } from './progress-indicator';

export { WizardNavigation } from './wizard-navigation';
export type { WizardNavigationProps } from './wizard-navigation';

export { GuestCountStep, calculateTotalPriceForWizard, validateGuestCount } from './steps';
export type { GuestCountStepProps } from './steps';

export { BookingSummaryCard, PriceBreakdown, calculatePromotionPrice } from './components';
export type { BookingSummaryCardProps, PriceBreakdownProps } from './components';

export {
  clearBookingState,
  deserializeBookingState,
  getExpirationTimeMs,
  getPersistedBookingId,
  isStateExpired,
  loadBookingState,
  saveBookingState,
  serializeBookingState,
} from './booking-persistence';
export type { PersistedBookingState } from './booking-persistence';
