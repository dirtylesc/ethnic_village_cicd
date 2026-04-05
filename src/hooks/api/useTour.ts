import { TabType, tourApi } from '@/data/apis/tour.api';
import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ApiResponse } from '@/types/api.type';
import { Tour, TourAdminListRequest, TourCreateRequest, TourListRequest } from '@/types/tour.type';

export const TOUR_QUERY_KEY = {
  LIST: 'tour-list',
  ADMIN_LIST: 'admin-tour-list',
  DETAIL: 'tour-detail',
};

export const useTourList = (params: TourListRequest) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.LIST, params],
    queryFn: () => tourApi.getTourList(params),
  });
};

export const useTourListByIds = (ids: string[]) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.LIST, ids],
    queryFn: async () => {
      if (ids.length === 0) return [];

      const response = await tourApi.getTourListByIds(ids);

      if (!response.data) {
        throw new Error('Failed to get tour list');
      }

      return response.data;
    },
  });
};

export const useTourDetail = (
  slug: string,
  options?: Omit<UseQueryOptions<ApiResponse<Tour>>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<ApiResponse<Tour>>({
    queryKey: [TOUR_QUERY_KEY.DETAIL, slug],
    queryFn: () => tourApi.getTourDetail(slug),
    enabled: !!slug,
    ...options,
  });
};

export const useFilteredTours = (tabType: TabType, page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['filtered-tours', tabType, page, size],
    queryFn: () => tourApi.getFilteredTours(tabType, page, size),
  });
};

export const useAdminTourList = (params: TourAdminListRequest) => {
  return useQuery({
    queryKey: [TOUR_QUERY_KEY.ADMIN_LIST, params],
    queryFn: () => tourApi.getAdminTourList(params),
  });
};

export const useAdminCreateTour = () => {
  return useMutation({
    mutationFn: async (request: TourCreateRequest) => {
      const res = await tourApi.createTour(request);
      return res;
    },
  });
};

export const useAdminUpdateTour = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TourCreateRequest> }) => {
      const res = await tourApi.updateTour(id, data);
      return res;
    },
  });
};

export const useAdminTourDetail = (id: string) => {
  return useQuery<ApiResponse<Tour>>({
    queryKey: [TOUR_QUERY_KEY.DETAIL, 'admin', id],
    queryFn: () => tourApi.getAdminTourDetail(id),
    enabled: !!id,
  });
};
