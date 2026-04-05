import { API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import {
  BookingConfirmRequest,
  BookingGetResponse,
  BookingListRequest,
  BookingListResponse,
  BookingStoreRequest,
  BookingStoreResponse,
  BookingUpdateRequest,
  BookingUpdateResponse,
} from '@/types/booking';
import { PageResponse } from '@/types/page.type';

export const bookingApi = {
  list: async (request: BookingListRequest) => {
    try {
      const queryParams = {
        ...request,
        status: request.status?.join(','),
        ethnicIds: request.ethnicIds?.join(','),
        page: request.page - 1,
      };

      const queryString = encodeQueryData(queryParams);

      const { data } = await api.get<ApiResponse<PageResponse<BookingListResponse>>>(
        `${API.BOOKING.SEARCH}?${queryString}`,
      );

      return data;
    } catch {
      throw new Error('Failed to get bookings');
    }
  },
  get: async (id: string) => {
    try {
      const { data } = await api.get<ApiResponse<BookingGetResponse>>(API.BOOKING.GET.replace('{id}', id));

      return data;
    } catch {
      throw new Error('Failed to get booking');
    }
  },
  getByOrderCode: async (orderCode: string) => {
    try {
      const { data } = await api.get<ApiResponse<BookingGetResponse>>(
        API.BOOKING.GET_BY_ORDER_CODE.replace('{orderCode}', orderCode),
      );

      return data;
    } catch {
      throw new Error('Failed to get booking by order code');
    }
  },
  store: async (request: BookingStoreRequest) => {
    try {
      const { data } = await api.post<ApiResponse<BookingStoreResponse>>(API.BOOKING.STORE, request);

      return data;
    } catch {
      throw new Error('Failed to create booking');
    }
  },
  update: async (request: BookingUpdateRequest) => {
    try {
      const { data } = await api.post<ApiResponse<BookingUpdateResponse>>(API.BOOKING.UPDATE, request);

      return data;
    } catch {
      throw new Error('Failed to update booking');
    }
  },
  updateContact: async (id: string, contactInfo: { name: string; email: string; phone: string }) => {
    try {
      const { data } = await api.post<ApiResponse<any>>(API.BOOKING.UPDATE_CONTACT.replace('{id}', id), contactInfo);

      return data;
    } catch {
      throw new Error('Failed to update contact information');
    }
  },
  confirmBooking: async (id: string, request: BookingConfirmRequest) => {
    try {
      const res = await api.post<ApiResponse<void>>(API.BOOKING.CONFIRM.replace('{id}', id), request);

      return res;
    } catch {
      throw new Error('Failed to confirm booking');
    }
  },

  cancel: async (id: string) => {
    try {
      const { data } = await api.post<ApiResponse<void>>(API.BOOKING.CANCEL.replace('{id}', id));
      return data;
    } catch {
      throw new Error('Failed to cancel booking');
    }
  },

  cancelByOrderCode: async (orderCode: string) => {
    try {
      const { data } = await api.post<ApiResponse<void>>(
        `${API.BOOKING.CANCEL_BY_ORDER_CODE}?orderCode=${orderCode}`,
      );
      return data;
    } catch {
      throw new Error('Failed to cancel booking');
    }
  },
};
