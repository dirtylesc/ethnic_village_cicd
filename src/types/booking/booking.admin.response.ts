import { AdminBooking } from './booking.admin';

export type TourBasicResponse = {
  tourId: string;
  title: string;
}

export type TourAvailableDateResponse = {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
  currentBookedSlots: number;
  status: string;
  tour: {
    id: string;
    title: string;
  };
}

export type AdminBookingResponse = {
  content: AdminBooking[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export type AdminBookingDetail = {
  id: string;
  tourAvailableDate: {
    id: string;
    startDate: string;
    endDate: string;
  };
  bookerDetail: {
    name: string;
    email: string;
    phone: string;
  };
  status: string;
  totalPrice: number;
  discountAmountApplied: number;
  personCount: {
    adultCount: number;
    childCount: number;
  };
  bookingDate: string;
}
