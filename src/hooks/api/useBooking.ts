import { bookingApi } from '@/data/apis/booking.api';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  BookingConfirmRequest,
  BookingGetResponse,
  BookingListRequest,
  BookingListResponse,
  BookingStoreRequest,
  BookingUpdateRequest,
} from '@/types/booking';
import { PageResponse } from '@/types/page.type';

export const useApiBookingList = (request: BookingListRequest) => {
  return useQuery({
    queryKey: ['bookings', request],
    queryFn: () => bookingApi.list(request),
    select: response => response.data as PageResponse<BookingListResponse>,
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApiBookingGet = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.get(id),
    enabled: !!id,
    select: response => response.data as BookingGetResponse,
  });
};

export const useApiBookingGetByOrderCode = (orderCode: string) => {
  return useQuery({
    queryKey: ['booking', 'orderCode', orderCode],
    queryFn: () => bookingApi.getByOrderCode(orderCode),
    enabled: !!orderCode,
    select: response => response.data as BookingGetResponse,
  });
};

export const useApiBookingStore = () => {
  return useMutation({
    mutationFn: async (request: BookingStoreRequest) => {
      const { data } = await bookingApi.store(request);
      return data;
    },
  });
};

export const useApiBookingUpdate = () => {
  return useMutation({
    mutationFn: async (request: BookingUpdateRequest) => {
      const { data } = await bookingApi.update(request);
      return data;
    },
  });
};

export const useApiBookingUpdateContact = () => {
  return useMutation({
    mutationFn: async ({
      id,
      contactInfo,
    }: {
      id: string;
      contactInfo: { name: string; email: string; phone: string };
    }) => {
      const { success } = await bookingApi.updateContact(id, contactInfo);
      return success;
    },
  });
};

export const useApiBookingConfirm = (id: string) => {
  return useMutation({
    mutationFn: async (request: BookingConfirmRequest) => {
      const { data } = await bookingApi.confirmBooking(id, request);
      return data;
    },
  });
};

export const useApiBookingCancel = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      const { success } = await bookingApi.cancel(id);
      return success;
    },
  });
};
