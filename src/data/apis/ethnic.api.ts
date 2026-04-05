import { API } from '@/core/api';
import api from '@/core/api/api';

import { Ethnic } from '@/types/ethnic.type';

export type EthnicListParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export type EthnicListResponse = {
  data: Ethnic[];
}

export const ethnicApi = {
  getEthnicAll: async (): Promise<EthnicListResponse> => {
    const { data } = await api.get(API.ETHNIC.GET_ALL);
    return data;
  },
};
