'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { TourInfo } from '@/types/booking/booking.type';

export type GuestCount = {
  adult: number;
  child: number;
}

export type ContactInfo = {
  name: string;
  email: string;
  phone: string;
}

export type GuestInfo = {
  name: string;
  email: string;
  phone: string;
}

export type PromotionInfo = {
  id: string;
  name: string;
  discountPercent: number;
  maxDiscountAmount: number;
}

export type BookingData = {
  tourId: string;
  tourSlug: string;
  tourInfo: TourInfo | null;
  selectedDateId: number | null;
  selectedDate: string;
  availableSlots: number;
  guestCount: GuestCount;
  contactInfo: ContactInfo | null;
  guestInfo: GuestInfo | null;
  bookingType: 'self' | 'others';
  promotion: PromotionInfo | null;
  additionalInfo: string;
}

export type BookingWizardState = {
  currentStep: number;
  completedSteps: Set<number>;
  bookingData: BookingData;
  validationErrors: Record<number, string[]>;
  isLoading: boolean;
}

export type BookingWizardActions = {
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateBookingData: (data: Partial<BookingData>) => void;
  setValidationErrors: (step: number, errors: string[]) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  resetWizard: () => void;
  markStepCompleted: (step: number) => void;
}

export const BOOKING_STEPS = {
  GUEST_COUNT: 0,
  CONTACT_INFO: 1,
  GUEST_INFO: 2,
  REVIEW: 3,
} as const;

export const TOTAL_STEPS = 4;

const initialBookingData: BookingData = {
  tourId: '',
  tourSlug: '',
  tourInfo: null,
  selectedDateId: null,
  selectedDate: '',
  availableSlots: 0,
  guestCount: { adult: 1, child: 0 },
  contactInfo: null,
  guestInfo: null,
  bookingType: 'self',
  promotion: null,
  additionalInfo: '',
};

const initialState: BookingWizardState = {
  currentStep: 0,
  completedSteps: new Set<number>(),
  bookingData: initialBookingData,
  validationErrors: {},
  isLoading: false,
};

type BookingWizardContextValue = {
  state: BookingWizardState;
  actions: BookingWizardActions;
}

const BookingWizardContext = createContext<BookingWizardContextValue | null>(null);

type BookingWizardProviderProps = {
  children: ReactNode;
  initialData?: Partial<BookingData>;
}

export function BookingWizardProvider({ children, initialData }: BookingWizardProviderProps) {
  const [state, setState] = useState<BookingWizardState>(() => ({
    ...initialState,
    bookingData: {
      ...initialBookingData,
      ...initialData,
    },
  }));

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= TOTAL_STEPS) return;
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= TOTAL_STEPS - 1) return prev;
      const newCompletedSteps = new Set(prev.completedSteps);
      newCompletedSteps.add(prev.currentStep);
      return {
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: newCompletedSteps,
      };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep <= 0) return prev;
      return {
        ...prev,
        currentStep: prev.currentStep - 1,
      };
    });
  }, []);

  const updateBookingData = useCallback((data: Partial<BookingData>) => {
    setState(prev => ({
      ...prev,
      bookingData: {
        ...prev.bookingData,
        ...data,
      },
    }));
  }, []);

  const setValidationErrors = useCallback((step: number, errors: string[]) => {
    setState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [step]: errors,
      },
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      validationErrors: {},
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  const markStepCompleted = useCallback((step: number) => {
    setState(prev => {
      const newCompletedSteps = new Set(prev.completedSteps);
      newCompletedSteps.add(step);
      return {
        ...prev,
        completedSteps: newCompletedSteps,
      };
    });
  }, []);

  const resetWizard = useCallback(() => {
    setState({
      ...initialState,
      bookingData: {
        ...initialBookingData,
        ...initialData,
      },
    });
  }, [initialData]);

  const actions: BookingWizardActions = useMemo(
    () => ({
      goToStep,
      nextStep,
      prevStep,
      updateBookingData,
      setValidationErrors,
      clearErrors,
      setLoading,
      resetWizard,
      markStepCompleted,
    }),
    [
      goToStep,
      nextStep,
      prevStep,
      updateBookingData,
      setValidationErrors,
      clearErrors,
      setLoading,
      resetWizard,
      markStepCompleted,
    ],
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <BookingWizardContext.Provider value={value}>{children}</BookingWizardContext.Provider>;
}

export function useBookingWizard() {
  const context = useContext(BookingWizardContext);
  if (!context) {
    throw new Error('useBookingWizard must be used within a BookingWizardProvider');
  }
  return context;
}

export function useBookingWizardState() {
  const { state } = useBookingWizard();
  return state;
}

export function useBookingWizardActions() {
  const { actions } = useBookingWizard();
  return actions;
}
