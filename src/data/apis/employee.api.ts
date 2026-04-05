import { AdminAPI, API } from '@/core/api';
import api from '@/core/api/api';

import { ApiResponse } from '@/types/api.type';
import {
  AssignedEmployeesByDatesRequest,
  AssignedEmployeesByDatesResponse,
  EmployeeBasicResponse,
  EmployeeDateRangeRequest,
} from '@/types/employee.type';

export const employeeApi = {
  getAvailableEmployees: async (
    tourAvailableDateId: string,
  ): Promise<ApiResponse<{ [dateId: string]: EmployeeBasicResponse[] }>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.AVAILABLE, { tourAvailableDateId });
    return data;
  },
  getAvailableEmployeesByDateRange: async (
    params: EmployeeDateRangeRequest,
  ): Promise<ApiResponse<EmployeeBasicResponse[]>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.AVAILABLE_BY_DATE_RANGE, params);
    return data;
  },
  getAssignedEmployeesByDates: async (
    params: AssignedEmployeesByDatesRequest,
  ): Promise<ApiResponse<AssignedEmployeesByDatesResponse>> => {
    const { data } = await api.post(AdminAPI.EMPLOYEE.ASSIGNED_BY_DATES, params);
    return data;
  },
  assignEmployees: async (
    assignments: { tourAvailableDateId: string; employeeIds: string[] }[],
  ): Promise<ApiResponse<any>> => {

    return { success: true } as any;
  },
  getActiveEmployees: async (): Promise<ApiResponse<EmployeeBasicResponse[]>> => {
    const { data } = await api.get(AdminAPI.EMPLOYEE.ACTIVE);
    return data;
  },
};
