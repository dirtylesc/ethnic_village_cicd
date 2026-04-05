import { create } from 'zustand';

import { BookingType } from '@/components/features/booking/order-detail/contact-information-card';

export type PersonInfo = {
  name: string;
  email: string;
  phone: string;
};

type BookingStore = {
  selectedDateId: string | number | undefined;
  availableSlots: number | undefined;
  guestInfo: PersonInfo | null;
  additionalInfo: string;
  bookingType: BookingType;
  contactInfo: PersonInfo | null;
  setSelectedDate: (dateId: string | number | undefined, slots: number | undefined) => void;
  setGuestInfo: (info: PersonInfo | null) => void;
  setAdditionalInfo: (info: string) => void;
  setBookingType: (type: 'self' | 'others') => void;
  setContactInfo: (info: PersonInfo | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>(set => ({
  selectedDateId: undefined,
  availableSlots: undefined,
  guestInfo: null,
  additionalInfo: '',
  bookingType: 'self',
  contactInfo: null,
  setSelectedDate: (dateId, slots) => set({ selectedDateId: dateId, availableSlots: slots }),
  setGuestInfo: info => set({ guestInfo: info }),
  setAdditionalInfo: info => set({ additionalInfo: info }),
  setBookingType: type => set({ bookingType: type }),
  setContactInfo: info => set({ contactInfo: info }),
  reset: () => set({ guestInfo: null, additionalInfo: '', contactInfo: null, bookingType: 'self' }),
}));
