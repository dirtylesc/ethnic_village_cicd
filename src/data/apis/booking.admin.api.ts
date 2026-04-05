import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import type { ApiResponse } from '@/types/api.type';
import type { AdminBookingListRequest } from '@/types/booking/booking.admin';
import type {
  AdminBookingResponse,
  TourAvailableDateResponse,
  TourBasicResponse,
} from '@/types/booking/booking.admin.response';

export const bookingAdminApi = {
  searchTours: async (searchKey: string = ''): Promise<ApiResponse<TourBasicResponse[]>> => {
    try {
      const queryString = encodeQueryData({ searchKey });
      const { data } = await api.get<ApiResponse<TourBasicResponse[]>>(`${AdminAPI.TOUR.SEARCH}?${queryString}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search tours: ${error.message}`);
      }
      throw new Error('Failed to search tours');
    }
  },

  getTourAvailableDates: async (tourId: string): Promise<ApiResponse<TourAvailableDateResponse[]>> => {
    try {
      const queryString = encodeQueryData({ tourId });
      const { data } = await api.get<ApiResponse<TourAvailableDateResponse[]>>(
        `${AdminAPI.TOUR.AVAILABLE_DAYS}?${queryString}`,
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get tour available dates: ${error.message}`);
      }
      throw new Error('Failed to get tour available dates');
    }
  },

  getAdminBookingList: async (params: AdminBookingListRequest): Promise<ApiResponse<AdminBookingResponse>> => {
    try {

      const queryParams: Record<string, string | number | boolean | null | undefined> = {
        ...params,
        tourAvailableDateIds: params.tourAvailableDateIds?.join(','),
        status: params.status?.join(','),
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<AdminBookingResponse>>(`${AdminAPI.BOOKING.LIST}?${queryString}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get admin booking list: ${error.message}`);
      }
      throw new Error('Failed to get admin booking list');
    }
  },
};
