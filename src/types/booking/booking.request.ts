import { BookingStatus, PaymentStatus } from '@/core/enum/booking.enum';
import { PersonInfo } from '@/stores/useBookingStore';

import { TourInfo } from './booking.type';

export type BookingStoreRequest = {
  tourSlug: string;
  availableDateId: string;
  adultCount: number;
  childCount: number;
}

export type BookingUpdateRequest = {
  id: string;
  tourSlug: string;
  availableDateId: number;
  adultCount: number;
  childCount: number;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  contactInformation?: any;
  guestInformation?: any;
  additionalInformation?: any;
}

export type BookingConfirmRequest = {
  promotionId?: string;
  discountAmountApplied?: number;
  guestInformation?: PersonInfo;
  additionalInformation?: string;
  totalPrice: number;
  tourData: TourInfo;
}

export type BookingListRequest = {
  bookingTab: 'PENDING' | 'OTHERS';
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
  ethnicIds?: number[];
  sortBy?: string;
  order?: 'asc' | 'desc';
  page: number;
  size: number;
}
