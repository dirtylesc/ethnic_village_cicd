import type { BookingData, BookingWizardState } from './booking-wizard-context';

const BOOKING_STORAGE_KEY = 'ethnic_village_booking_state';
const EXPIRATION_TIME_MS = 30 * 60 * 1000;

export type PersistedBookingState = {
  bookingId: string;
  bookingData: BookingData;
  currentStep: number;
  completedSteps: number[];
  timestamp: number;
  expiresAt: number;
}

function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function serializeBookingState(state: BookingWizardState, existingBookingId?: string): PersistedBookingState {
  const now = Date.now();
  return {
    bookingId: existingBookingId || generateBookingId(),
    bookingData: state.bookingData,
    currentStep: state.currentStep,
    completedSteps: Array.from(state.completedSteps),
    timestamp: now,
    expiresAt: now + EXPIRATION_TIME_MS,
  };
}

export function deserializeBookingState(persisted: PersistedBookingState): BookingWizardState {
  return {
    currentStep: persisted.currentStep,
    completedSteps: new Set(persisted.completedSteps),
    bookingData: persisted.bookingData,
    validationErrors: {},
    isLoading: false,
  };
}

export function isStateExpired(persisted: PersistedBookingState, currentTime?: number): boolean {
  const now = currentTime ?? Date.now();
  return now >= persisted.expiresAt;
}

export function saveBookingState(state: BookingWizardState, existingBookingId?: string): string {
  const persisted = serializeBookingState(state, existingBookingId);
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(persisted));
  }
  return persisted.bookingId;
}

export function loadBookingState(currentTime?: number): BookingWizardState | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const persisted: PersistedBookingState = JSON.parse(stored);

    if (isStateExpired(persisted, currentTime)) {
      clearBookingState();
      return null;
    }

    return deserializeBookingState(persisted);
  } catch {
    clearBookingState();
    return null;
  }
}

export function clearBookingState(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  }
}

export function getPersistedBookingId(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const persisted: PersistedBookingState = JSON.parse(stored);
    return persisted.bookingId;
  } catch {
    return null;
  }
}

export function getExpirationTimeMs(): number {
  return EXPIRATION_TIME_MS;
}
