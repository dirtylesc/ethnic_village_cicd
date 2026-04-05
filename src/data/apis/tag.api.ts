import { API } from '@/core/api';
import api from '@/core/api/api';

import { Tag } from '@/types/tag.type';

export type TagListResponse = {
  data: Tag[];
}

export const tagApi = {
  getTagAll: async (): Promise<TagListResponse> => {
    const { data } = await api.get(API.TAG.GET_ALL);
    return data;
  },
};
