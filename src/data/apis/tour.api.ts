import { AdminAPI, API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';
import { TourFilterTabType } from '@/core/enum/tour.enum';

import { ApiResponse } from '@/types/api.type';
import {
  Tour,
  TourAdminListRequest,
  TourCreateRequest,
  TourListRequest,
  TourListResponse,
  TourResponse,
} from '@/types/tour.type';

export type TabType = 'popular' | 'outstanding' | 'best_price';

const mapTabTypeToBackend = (tabType: TabType): TourFilterTabType => {
  const mapping: Record<TabType, TourFilterTabType> = {
    popular: TourFilterTabType.POPULAR,
    outstanding: TourFilterTabType.OUTSTANDING,
    best_price: TourFilterTabType.BEST_PRICE,
  };
  return mapping[tabType];
};

export const tourApi = {
  getTourList: async (params: TourListRequest): Promise<ApiResponse<TourListResponse>> => {
    try {
      const queryParams = {
        ...params,
        tagIds: params.tagIds?.join(','),
        ethnicIds: params.ethnicIds?.join(','),
        locationIds: params.locationIds?.join(','),
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<TourListResponse>>(`${API.TOUR.SEARCH}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get tour list');
    }
  },

  getTourListByIds: async (ids: string[]): Promise<ApiResponse<Tour[]>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour[]>>(`${API.TOUR.GET_BY_IDS}?ids=${ids.join(',')}`);
      return data;
    } catch {
      throw new Error('Failed to get tour list by ids');
    }
  },

  getTourDetail: async (slug: string): Promise<ApiResponse<Tour>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour>>(`${API.TOUR.DETAIL}/${slug}`);
      return data;
    } catch {
      throw new Error('Failed to get tour detail');
    }
  },

  getFilteredTours: async (
    tabType: TabType = 'popular',
    page: number = 0,
    size: number = 10,
  ): Promise<ApiResponse<Tour[]>> => {
    try {
      const requestBody = {
        tabType: mapTabTypeToBackend(tabType),
        page,
        size,
      };

      const queryString = encodeQueryData(requestBody);
      const { data } = await api.get<ApiResponse<TourListResponse>>(`${API.TOUR.FILTER_TAB}?${queryString}`);

      return {
        code: data.code,
        success: data.success,
        message: data.message,
        data: data.data?.content || [],
      };
    } catch {
      throw new Error('Failed to get filtered tours');
    }
  },

  getSimilarTours: async (slug: string, limit: number = 4): Promise<ApiResponse<Tour[]>> => {
    try {
      const { data } = await api.get<ApiResponse<Tour[]>>(`${API.TOUR.DETAIL}/${slug}/similar?limit=${limit}`);
      return data;
    } catch {
      throw new Error('Failed to get similar tours');
    }
  },

  getAdminTourList: async (params: TourAdminListRequest): Promise<ApiResponse<TourListResponse>> => {
    try {
      const queryParams = {
        ...params,
        ethnicIds: params.ethnicIds?.join(','),
        locationIds: params.locationIds?.join(','),
        status: params.status?.join(','),
        sortBy: params.sortBy === 'price' ? 'adultPrice' : params.sortBy,
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<TourListResponse>>(`${AdminAPI.TOUR.LIST}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get tour list');
    }
  },
  createTour: async (data: TourCreateRequest): Promise<ApiResponse<TourResponse>> => {
    try {
      const res = await api.post(AdminAPI.TOUR.STORE, data);
      return res.data;
    } catch {
      throw new Error('Failed to store tour');
    }
  },

  updateTour: async (id: string, data: Partial<TourCreateRequest>): Promise<ApiResponse<TourResponse>> => {
    try {
      const res = await api.put(`${AdminAPI.TOUR.LIST}/${id}`, data);
      return res.data;
    } catch {
      throw new Error('Failed to update tour');
    }
  },

  getAdminTourDetail: async (id: string): Promise<ApiResponse<Tour>> => {
    try {
      const { data } = await api.get(`${AdminAPI.TOUR.LIST}/${id}`);
      return data;
    } catch {
      throw new Error('Failed to get admin tour detail');
    }
  },
};
