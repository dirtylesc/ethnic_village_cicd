import { BookingStatus } from '@/core/enum/booking.enum';
import { TourAvailableDateStatus } from '@/core/enum/tour.enum';

export type AdminBookingListRequest = {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string;
  toDate?: string;
  page: number;
  size: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export type BookingFilters = {
  tourId?: string;
  tourAvailableDateIds?: string[];
  status?: BookingStatus[];
  fromDate?: string;
  toDate?: string;
}

export type AdminBooking = {
  bookingId: string;
  bookerDetail: {
    email: string;
    name: string;
    phone: string;
  };
  bookingDate: string;
  status: BookingStatus;
  totalPrice: number;
  discountAmountApplied?: number;
  bookingStatus: string;
  createdAt: string;
  tourAvailableDate: {
    id: string;
    startDate: string;
    endDate: string;
    status: TourAvailableDateStatus;
    maxSlots: number;
  };
  personCount: {
    adult: number;
    child: number;
  };
  tour: {
    id: string;
    title: string;
  };
}
