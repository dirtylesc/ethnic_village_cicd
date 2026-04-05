import type {
  Promotion,
  PromotionAdminListRequest,
  PromotionCreateRequest,
  PromotionListResponse,
  PromotionUpdateRequest,
} from '@/types/promotion.type';

import api from '../api';
import { AdminAPI } from '../config';

export const getAdminPromotions = async (
  request?: PromotionAdminListRequest,
): Promise<PromotionListResponse> => {
  const params = new URLSearchParams();
  if (request?.page !== undefined) params.append('page', String(request.page));
  if (request?.size !== undefined) params.append('size', String(request.size));
  if (request?.search) params.append('search', request.search);
  if (request?.status) params.append('status', request.status);
  if (request?.type) params.append('type', request.type);
  if (request?.fromDate) params.append('fromDate', request.fromDate);
  if (request?.toDate) params.append('toDate', request.toDate);
  if (request?.sortBy) params.append('sortBy', request.sortBy);
  if (request?.sortDirection) params.append('sortDirection', request.sortDirection);

  const response = await api.get<{ data: PromotionListResponse }>(
    `${AdminAPI.PROMOTION.LIST}?${params.toString()}`,
  );
  return response.data.data;
};

export const getAdminPromotionById = async (id: string): Promise<Promotion> => {
  const response = await api.get<{ data: Promotion }>(`${AdminAPI.PROMOTION.DETAIL}/${id}`);
  return response.data.data;
};

export const createAdminPromotion = async (data: PromotionCreateRequest): Promise<Promotion> => {
  const response = await api.post<{ data: Promotion }>(AdminAPI.PROMOTION.CREATE, data);
  return response.data.data;
};

export const updateAdminPromotion = async (
  id: string,
  data: PromotionUpdateRequest,
): Promise<Promotion> => {
  const response = await api.put<{ data: Promotion }>(`${AdminAPI.PROMOTION.UPDATE}/${id}`, data);
  return response.data.data;
};

export const deleteAdminPromotion = async (id: string): Promise<void> => {
  await api.delete(`${AdminAPI.PROMOTION.DELETE}/${id}`);
};
