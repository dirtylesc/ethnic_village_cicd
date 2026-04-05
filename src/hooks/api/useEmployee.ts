import {
  createAdminEmployee,
  deleteAdminEmployee,
  getAdminEmployeeById,
  getAdminEmployees,
  updateAdminEmployee,
} from '@/core/api/admin/employee.admin.api';
import { employeeApi } from '@/data/apis/employee.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { EmployeeFilters, UpdateEmployeeRequest } from '@/types/employee.type';
import {
  AssignedEmployeesByDatesRequest,
  CreateEmployeeRequest,
  EmployeeDateRangeRequest,
} from '@/types/employee.type';

export const useAvailableEmployees = (availableDateId?: string) => {
  return useQuery({
    queryKey: ['available-employees', availableDateId],
    queryFn: async () => {
      if (!availableDateId) return [];
      const res = await employeeApi.getAvailableEmployees(availableDateId);
      return res.data || [];
    },
    enabled: !!availableDateId,
  });
};

export const useAvailableEmployeesByDateRange = (params?: EmployeeDateRangeRequest) => {
  return useQuery({
    queryKey: ['available-employees-by-date-range', params],
    queryFn: async () => {
      if (!params?.startDate || !params?.endDate) return [];
      const res = await employeeApi.getAvailableEmployeesByDateRange(params);
      return res.data || [];
    },
    enabled: !!params?.startDate && !!params?.endDate,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useAssignedEmployeesByDates = (
  params?: AssignedEmployeesByDatesRequest,
  options?: { enabled?: boolean; staleTime?: number; refetchOnMount?: boolean },
) => {
  return useQuery({
    queryKey: ['assigned-employees-by-dates', params],
    queryFn: async () => {
      if (!params?.availableDateIds?.length) return { assignedEmployeesByDate: {} };
      const res = await employeeApi.getAssignedEmployeesByDates(params);
      return res.data || { assignedEmployeesByDate: {} };
    },
    enabled: options?.enabled ?? !!params?.availableDateIds?.length,
    staleTime: options?.staleTime ?? 0,
    refetchOnMount: options?.refetchOnMount ?? true,
  });
};

export const useAssignEmployees = () => {
  return useMutation({
    mutationFn: employeeApi.assignEmployees,
  });
};

export const useActiveEmployees = () => {
  return useQuery({
    queryKey: ['active-employees'],
    queryFn: async () => {
      const res = await employeeApi.getActiveEmployees();
      return res.data || [];
    },
  });
};

export const employeeAdminQueryKeys = {
  all: ['admin-employees'] as const,
  list: (page: number, size: number, filters?: EmployeeFilters) =>
    [...employeeAdminQueryKeys.all, 'list', page, size, filters] as const,
  detail: (id: string) => [...employeeAdminQueryKeys.all, 'detail', id] as const,
};

export const useAdminEmployees = (page = 0, size = 10, filters?: EmployeeFilters) => {
  return useQuery({
    queryKey: employeeAdminQueryKeys.list(page, size, filters),
    queryFn: () => getAdminEmployees(page, size, filters),
  });
};

export const useAdminEmployeeById = (id: string) => {
  return useQuery({
    queryKey: employeeAdminQueryKeys.detail(id),
    queryFn: () => getAdminEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateAdminEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeRequest) => createAdminEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeAdminQueryKeys.all });
    },
  });
};

export const useUpdateAdminEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeRequest }) => updateAdminEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeAdminQueryKeys.all });
    },
  });
};

export const useDeleteAdminEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeAdminQueryKeys.all });
    },
  });
};
