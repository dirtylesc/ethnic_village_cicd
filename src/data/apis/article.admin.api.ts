import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse, PaginatedResponse } from '@/types/api.type';
import {
  ArticleAdmin,
  ArticleAdminListRequest,
  ArticleAdminPayload,
  ArticleAdminStatusPayload,
} from '@/types/article.type';
import { encodeQueryData } from '@/core/api/utils';

export const articleAdminApi = {
  getArticles: async (
    params?: ArticleAdminListRequest,
  ): Promise<ApiResponse<PaginatedResponse<ArticleAdmin>>> => {
    const queryParams = {
      ...(params?.searchKey && { searchKey: params.searchKey }),
      ...(params?.status && { status: params.status }),
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy ?? 'createdAt',
      order: params?.order ?? 'desc',
    };
    const query = encodeQueryData(queryParams);
    const { data } = await api.get(`${AdminAPI.ARTICLE.LIST}?${query}`);
    return data;
  },

  getArticleDetail: async (id: string): Promise<ApiResponse<ArticleAdmin>> => {
    const { data } = await api.get(`${AdminAPI.ARTICLE.DETAIL}/${id}`);
    return data;
  },

  createArticle: async (payload: ArticleAdminPayload): Promise<ApiResponse<ArticleAdmin>> => {
    const { data } = await api.post(AdminAPI.ARTICLE.CREATE, payload);
    return data;
  },

  updateArticle: async (id: string, payload: ArticleAdminPayload): Promise<ApiResponse<ArticleAdmin>> => {
    const { data } = await api.put(`${AdminAPI.ARTICLE.UPDATE}/${id}`, payload);
    return data;
  },

  deleteArticle: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`${AdminAPI.ARTICLE.DELETE}/${id}`);
    return data;
  },

  updateStatus: async (id: string, payload: ArticleAdminStatusPayload): Promise<ApiResponse<ArticleAdmin>> => {
    const { data } = await api.patch(`${AdminAPI.ARTICLE.UPDATE_STATUS}/${id}/status`, payload);
    return data;
  },
};
