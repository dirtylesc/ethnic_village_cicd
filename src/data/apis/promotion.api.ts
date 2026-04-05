import { API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import { PromotionValidateResponse } from '@/types/promotion.type';

export const promotionApi = {
  validatePromotion: async (code: string, tourId: string) => {
    const response = await api.get<ApiResponse<PromotionValidateResponse>>(API.PROMOTION.VALIDATE, {
      params: {
        code,
        tourId,
      },
    });
    return response.data;
  },

  getBestDirectDiscount: async (tourId: string) => {
    const response = await api.get<ApiResponse<PromotionValidateResponse>>(
      API.PROMOTION.BEST_DIRECT_DISCOUNT,
      {
        params: {
          tourId,
        },
      }
    );
    return response.data;
  },
};
