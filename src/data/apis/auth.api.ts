import { API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import { LoginRequest, LoginResponse, SignupRequest } from '@/types/auth.type';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(API.AUTH.SIGNIN, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to login');
    }
  },

  signup: async (data: SignupRequest): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(API.AUTH.SIGNUP, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to signup');
    }
  },
};
