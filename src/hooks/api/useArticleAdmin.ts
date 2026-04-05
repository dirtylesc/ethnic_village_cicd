import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { articleAdminApi } from '@/data/apis/article.admin.api';
import {
  ArticleAdminListRequest,
  ArticleAdminPayload,
  ArticleAdminStatusPayload,
} from '@/types/article.type';

export const ADMIN_ARTICLE_QUERY_KEY = {
  LIST: 'admin-article-list',
  DETAIL: 'admin-article-detail',
};

export const useAdminArticleList = (params?: ArticleAdminListRequest) => {
  return useQuery({
    queryKey: [ADMIN_ARTICLE_QUERY_KEY.LIST, params],
    queryFn: () => articleAdminApi.getArticles(params),
  });
};

export const useAdminArticleDetail = (id: string) => {
  return useQuery({
    queryKey: [ADMIN_ARTICLE_QUERY_KEY.DETAIL, id],
    queryFn: () => articleAdminApi.getArticleDetail(id),
    enabled: !!id,
  });
};

export const useCreateAdminArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ArticleAdminPayload) => articleAdminApi.createArticle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.LIST] });
    },
  });
};

export const useUpdateAdminArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ArticleAdminPayload }) =>
      articleAdminApi.updateArticle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.DETAIL] });
    },
  });
};

export const useDeleteAdminArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleAdminApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.LIST] });
    },
  });
};

export const useUpdateAdminArticleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ArticleAdminStatusPayload }) =>
      articleAdminApi.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_ARTICLE_QUERY_KEY.DETAIL] });
    },
  });
};
