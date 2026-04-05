import { API } from '@/core/api';
import api from '@/core/api/api';

import { Location } from '@/types/location.type';

export type LocationListParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export type LocationListResponse = {
  data: Location[];
}

export const locationApi = {
  getLocationAll: async (): Promise<LocationListResponse> => {
    const { data } = await api.get(API.LOCATION.GET_ALL);
    return data;
  },
};
