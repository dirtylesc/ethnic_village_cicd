import { BookingStatus } from '@/core/enum/booking.enum';

import { TourInfo } from './booking.type';

export type BookingStoreResponse = {
  id: string;
  tour: TourInfo;
  personCount: Record<string, any>;
  totalPrice: number;
  bookingDate: string;
  status: string;
  startDate: string;
  endDate: string;
}

export type BookingUpdateResponse = {
  id: string;
  tourSlug: string;
  availableDateId: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingGetResponse = {
  id: string;
  personCount: Record<string, any>;
  status: BookingStatus;
  bookerDetail: Record<string, any>;
  passengerDetail: Record<string, any>;
  totalPrice: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
  discountAmountApplied: number;
  tour: TourInfo;
  additionalInformation?: string;
  paymentExpiredDate: string;
}

export type BookingListResponse = {
  id: string;
  personCount: Record<string, any>;
  status: string;
  totalPrice: number;
  bookingDate: Date;
  startDate: Date;
  endDate: Date;
  paymentExpiredDate: Date;
  discountAmountApplied?: number;
  tour: TourInfo;
}
