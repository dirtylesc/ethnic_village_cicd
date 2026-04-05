import { AdminAPI } from '@/core/api';
import api from '@/core/api/api';

import type { ApiResponse } from '@/types/api.type';
import type {
  AssignedAvailableDateListResponse,
  AssignedAvailableDatesRequest,
  AssignmentHistoryRequest,
  AssignmentHistoryResponse,
  CalendarAssignmentResponse,
  CalendarAssignmentsRequest,
  SingleAssignmentRequest,
  TourAssignmentRequest,
  TourAssignmentResponse,
  UpdateTourAvailableDateStatusRequest,
  TourAvailableDateStatusUpdateResponse,
} from '@/types/tour-assignment.type';

export const tourAssignmentApi = {
  assign: async (payload: TourAssignmentRequest): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGN, payload);
    return data;
  },

  assignSingleDate: async (payload: SingleAssignmentRequest): Promise<ApiResponse<TourAssignmentResponse>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGN_SINGLE, payload);
    return data;
  },

  search: async (payload: any): Promise<ApiResponse<TourAssignmentResponse[]>> => {
    const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.SEARCH, payload);
    return data;
  },

  getAssignedAvailableDates: async (
    payload: AssignedAvailableDatesRequest,
  ): Promise<ApiResponse<AssignedAvailableDateListResponse>> => {
    try {
      const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.ASSIGNED_AVAILABLE_DATES, payload);
      return data;
    } catch (error) {

      if (error instanceof Error) {
        throw new Error(`Failed to fetch assigned available dates: ${error.message}`);
      }
      throw new Error('Failed to fetch assigned available dates');
    }
  },

  getCalendarAssignments: async (
    payload: CalendarAssignmentsRequest,
  ): Promise<ApiResponse<CalendarAssignmentResponse[]>> => {
    try {
      const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.CALENDAR_ASSIGNMENTS, payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch calendar assignments: ${error.message}`);
      }
      throw new Error('Failed to fetch calendar assignments');
    }
  },

  getAssignmentHistory: async (
    payload: AssignmentHistoryRequest,
  ): Promise<ApiResponse<AssignmentHistoryResponse[]>> => {
    try {
      const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.HISTORY, payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch assignment history: ${error.message}`);
      }
      throw new Error('Failed to fetch assignment history');
    }
  },

  updateTourAvailableDateStatus: async (
    payload: UpdateTourAvailableDateStatusRequest,
  ): Promise<ApiResponse<TourAvailableDateStatusUpdateResponse>> => {
    try {
      const { data } = await api.post(AdminAPI.TOUR_ASSIGNMENT.UPDATE_STATUS, payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update tour status: ${error.message}`);
      }
      throw new Error('Failed to update tour status');
    }
  },
};
