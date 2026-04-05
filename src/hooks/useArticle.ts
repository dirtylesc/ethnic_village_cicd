import { articleApi } from '@/data/apis/article.api';
import { useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/types/api.type';
import { Article, ArticleListRequest } from '@/types/article.type';

export const ARTICLE_QUERY_KEY = {
  LIST: 'article-list',
  DETAIL: 'article-detail',
};

export const useArticleList = (params?: ArticleListRequest) => {
  return useQuery({
    queryKey: [ARTICLE_QUERY_KEY.LIST, params],
    queryFn: () => articleApi.getArticleList(params),
  });
};

export const useArticleDetail = (slug: string) => {
  return useQuery<ApiResponse<Article>>({
    queryKey: [ARTICLE_QUERY_KEY.DETAIL, slug],
    queryFn: () => articleApi.getArticleDetail(slug),
    enabled: !!slug,
  });
};
