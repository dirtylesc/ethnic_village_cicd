import { promotionApi } from '@/data/apis/promotion.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createAdminPromotion,
  deleteAdminPromotion,
  getAdminPromotionById,
  getAdminPromotions,
  updateAdminPromotion,
} from '@/core/api/admin/promotion.admin.api';
import type {
  PromotionAdminListRequest,
  PromotionCreateRequest,
  PromotionUpdateRequest,
} from '@/types/promotion.type';

export const useApiValidatePromotion = () => {
  return useMutation({
    mutationFn: async ({ code, tourId }: { code: string; tourId: string }) => {
      const res = await promotionApi.validatePromotion(code, tourId);
      return res.data;
    },
  });
};

export const PROMOTION_QUERY_KEY = {
  LIST: 'promotion-admin-list',
  DETAIL: 'promotion-admin-detail',
};

export const useAdminPromotions = (request?: PromotionAdminListRequest) => {
  return useQuery({
    queryKey: [PROMOTION_QUERY_KEY.LIST, request],
    queryFn: () => getAdminPromotions(request),
  });
};

export const useAdminPromotionDetail = (id: string) => {
  return useQuery({
    queryKey: [PROMOTION_QUERY_KEY.DETAIL, id],
    queryFn: () => getAdminPromotionById(id),
    enabled: !!id,
  });
};

export const useCreateAdminPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PromotionCreateRequest) => createAdminPromotion(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY.LIST] });
    },
  });
};

export const useUpdateAdminPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: PromotionUpdateRequest }) =>
      updateAdminPromotion(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY.DETAIL] });
    },
  });
};

export const useDeleteAdminPromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminPromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOTION_QUERY_KEY.LIST] });
    },
  });
};
