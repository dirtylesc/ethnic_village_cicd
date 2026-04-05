import { permissionAdminApi } from '@/data/apis/permission.admin.api';
import { useQuery } from '@tanstack/react-query';

export const PERMISSION_QUERY_KEYS = {
  all: ['permissions'] as const,
  list: () => [...PERMISSION_QUERY_KEYS.all, 'list'] as const,
  grouped: () => [...PERMISSION_QUERY_KEYS.all, 'grouped'] as const,
};

export const usePermissions = () => {
  return useQuery({
    queryKey: PERMISSION_QUERY_KEYS.list(),
    queryFn: async () => {
      const res = await permissionAdminApi.getAllPermissions();
      return res.data || [];
    },
  });
};

export const useGroupedPermissions = () => {
  return useQuery({
    queryKey: PERMISSION_QUERY_KEYS.grouped(),
    queryFn: async () => {
      const res = await permissionAdminApi.getGroupedPermissions();
      return res.data || [];
    },
  });
};
