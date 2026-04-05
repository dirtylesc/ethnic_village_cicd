import type { PaginatedResponse } from '@/types/api.type';
import type {
  CreateEmployeeRequest,
  EmployeeAdmin,
  EmployeeFilters,
  UpdateEmployeeRequest,
} from '@/types/employee.type';

import api from '../api';
import { AdminAPI } from '../config';

export const getAdminEmployees = async (
  page = 0,
  size = 10,
  filters?: EmployeeFilters,
): Promise<PaginatedResponse<EmployeeAdmin>> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('size', String(size));
  if (filters?.search) params.append('search', filters.search);
  if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

  const response = await api.get<{ data: PaginatedResponse<EmployeeAdmin> }>(
    `${AdminAPI.EMPLOYEE.LIST}?${params.toString()}`,
  );
  return response.data.data;
};

export const getAdminEmployeeById = async (id: string): Promise<EmployeeAdmin> => {
  const response = await api.get<{ data: EmployeeAdmin }>(`${AdminAPI.EMPLOYEE.DETAIL}/${id}`);
  return response.data.data;
};

export const createAdminEmployee = async (data: CreateEmployeeRequest): Promise<EmployeeAdmin> => {
  const response = await api.post<{ data: EmployeeAdmin }>(AdminAPI.EMPLOYEE.LIST, data);
  return response.data.data;
};

export const updateAdminEmployee = async (id: string, data: UpdateEmployeeRequest): Promise<EmployeeAdmin> => {
  const response = await api.put<{ data: EmployeeAdmin }>(`${AdminAPI.EMPLOYEE.UPDATE}/${id}`, data);
  return response.data.data;
};

export const deleteAdminEmployee = async (id: string): Promise<void> => {
  await api.delete(`${AdminAPI.EMPLOYEE.DELETE}/${id}`);
};
