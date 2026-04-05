import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse, PaginatedResponse } from '@/types/api.type';
import { CreateUserRequest, UpdateUserRequest, UserAdmin, UserFilters } from '@/types/user.type';

export const userAdminApi = {
  getUsers: async (
    page: number = 0,
    size: number = 10,
    filters?: UserFilters,
  ): Promise<ApiResponse<PaginatedResponse<UserAdmin>>> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));

    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.roleId) {
      params.append('roleId', filters.roleId);
    }
    if (filters?.active !== undefined) {
      params.append('active', String(filters.active));
    }

    const { data } = await api.get(`${AdminAPI.USER.LIST}?${params.toString()}`);
    return data;
  },

  getUserById: async (id: string): Promise<ApiResponse<UserAdmin>> => {
    const { data } = await api.get(`${AdminAPI.USER.DETAIL}/${id}`);
    return data;
  },

  createUser: async (request: CreateUserRequest): Promise<ApiResponse<UserAdmin>> => {
    const { data } = await api.post(AdminAPI.USER.CREATE, request);
    return data;
  },

  updateUser: async (id: string, request: UpdateUserRequest): Promise<ApiResponse<UserAdmin>> => {
    const { data } = await api.put(`${AdminAPI.USER.UPDATE}/${id}`, request);
    return data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`${AdminAPI.USER.DELETE}/${id}`);
    return data;
  },
};
