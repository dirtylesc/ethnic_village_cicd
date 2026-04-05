import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import { Permission, PermissionGroup } from '@/types/role.type';

export const permissionAdminApi = {
  getAllPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const { data } = await api.get(AdminAPI.PERMISSION.LIST);
    return data;
  },

  getGroupedPermissions: async (): Promise<ApiResponse<PermissionGroup[]>> => {
    const { data } = await api.get(AdminAPI.PERMISSION.GROUPED);
    return data;
  },
};
