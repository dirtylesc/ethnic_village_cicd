import { categoryApi } from '@/data/apis/category.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CategoryCreateRequest, CategoryTourRequest, CategoryUpdateRequest } from '@/types/category.type';

export const CATEGORY_QUERY_KEY = {
  LIST: 'category-list',
  ENABLED: 'enabled-categories',
  DETAIL: 'category-detail',
};

export const useEnabledCategories = () => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY.ENABLED],
    queryFn: () => categoryApi.getEnabledCategories(),
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY.LIST],
    queryFn: () => categoryApi.getAllCategories(),
  });
};

export const useCategoryDetail = (id: string) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY.DETAIL, id],
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CategoryCreateRequest) => categoryApi.createCategory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: CategoryUpdateRequest }) =>
      categoryApi.updateCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.DETAIL] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};

export const useAddToursToCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: CategoryTourRequest }) =>
      categoryApi.addToursToCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.DETAIL] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};

export const useRemoveToursFromCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: CategoryTourRequest }) =>
      categoryApi.removeToursFromCategory(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.DETAIL] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};

export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.toggleCategoryStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY.ENABLED] });
    },
  });
};
