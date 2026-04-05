import { API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import { Article, ArticleListRequest, ArticleListResponse } from '@/types/article.type';

const normalizeArticle = (article: any): Article => {
  const publishedDate = article.publishedDate || article.published_date;
  return {
    ...article,
    publishedDate: publishedDate || null,
  };
};

const normalizeArticleListResponse = (response: any): ArticleListResponse => {
  return {
    ...response,
    content: response.content?.map(normalizeArticle) || [],
  };
};

export const articleApi = {
  getArticleList: async (params?: ArticleListRequest): Promise<ApiResponse<ArticleListResponse>> => {
    try {
      const queryParams = {
        ...(params?.searchKey && { searchKey: params.searchKey }),
        ...(params?.sortBy && { sortBy: params.sortBy }),
        ...(params?.order && { order: params.order }),
        ...(params?.tagIds && { tagIds: params.tagIds }),
        page: params?.page ?? 0,
        size: params?.size ?? 4,
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<ArticleListResponse>>(`${API.POST.GET_ALL}?${queryString}`);

      return {
        ...data,
        data: data.data ? normalizeArticleListResponse(data.data) : data.data,
      };
    } catch {
      throw new Error('Failed to get article list');
    }
  },

  getArticleDetail: async (slug: string): Promise<ApiResponse<Article>> => {
    try {
      const queryParams = {
        page: 0,
        size: 100,
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<ArticleListResponse>>(`${API.POST.GET_ALL}?${queryString}`);

      const list = data.data ? normalizeArticleListResponse(data.data) : null;
      const found = list?.content.find(article => article.slug === slug) || null;

      return {
        ...data,
        data: found ? normalizeArticle(found) : (null as any),
      };
    } catch {
      throw new Error('Failed to get article detail');
    }
  },
};
