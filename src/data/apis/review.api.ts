import { API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import { Review } from '@/types/review.type';

export const reviewApi = {
  addReview: async (data: {
    rating: number;
    content: string;
    entityId: number;
    entityType: string;
  }): Promise<ApiResponse<Review>> => {
    const response = await api.post<ApiResponse<Review>>(API.REVIEW.ADD, data);
    return response.data;
  },

  editReview: async (reviewId: number, data: { rating: number; content: string }): Promise<ApiResponse<Review>> => {
    const response = await api.put<ApiResponse<Review>>(`${API.REVIEW.EDIT}/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`${API.REVIEW.DELETE}/${reviewId}`);
    return response.data;
  },

  pinReview: async (reviewId: number): Promise<ApiResponse<Review>> => {
    const response = await api.put<ApiResponse<Review>>(`${API.REVIEW.PIN}/${reviewId}`);
    return response.data;
  },

  reportReview: async (reviewId: number, reason: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`${API.REVIEW.REPORT}/${reviewId}`, { reason });
    return response.data;
  },
};
