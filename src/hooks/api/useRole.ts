import { roleAdminApi } from '@/data/apis/role.admin.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CreateRoleRequest, UpdateRoleRequest } from '@/types/role.type';

export const ROLE_QUERY_KEYS = {
  all: ['roles'] as const,
  list: (page: number, size: number) => [...ROLE_QUERY_KEYS.all, 'list', page, size] as const,
  detail: (id: string) => [...ROLE_QUERY_KEYS.all, 'detail', id] as const,
};

export const useRoles = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.list(page, size),
    queryFn: async () => {
      const res = await roleAdminApi.getRoles(page, size);
      return res.data;
    },
  });
};

export const useRoleById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const res = await roleAdminApi.getRoleById(id);
      return res.data;
    },
    enabled: options?.enabled ?? !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRoleRequest) => roleAdminApi.createRole(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateRoleRequest }) => roleAdminApi.updateRole(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roleAdminApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
    },
  });
};
