import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse, PaginatedResponse } from '@/types/api.type';
import { CreateRoleRequest, Role, UpdateRoleRequest } from '@/types/role.type';

export const roleAdminApi = {
  getRoles: async (page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<Role>>> => {
    const { data } = await api.get(`${AdminAPI.ROLE.LIST}?page=${page}&size=${size}`);
    return data;
  },

  getRoleById: async (id: string): Promise<ApiResponse<Role>> => {
    const { data } = await api.get(`${AdminAPI.ROLE.DETAIL}/${id}`);
    return data;
  },

  createRole: async (request: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    const { data } = await api.post(AdminAPI.ROLE.CREATE, request);
    return data;
  },

  updateRole: async (id: string, request: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const { data } = await api.put(`${AdminAPI.ROLE.UPDATE}/${id}`, request);
    return data;
  },

  deleteRole: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`${AdminAPI.ROLE.DELETE}/${id}`);
    return data;
  },
};
