import api from '@/core/api/api';
import { AdminAPI } from '@/core/api/config';

import { ApiResponse } from '@/types/api.type';
import { DashboardStats, RecentBooking, RevenueChartData, TopDestination, UpcomingDeparture } from '@/types/dashboard';

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get<ApiResponse<DashboardStats>>(AdminAPI.DASHBOARD.STATS);
    return data;
  },

  getUpcomingDepartures: async (days: number = 7, limit: number = 10) => {
    const { data } = await api.get<ApiResponse<UpcomingDeparture[]>>(
      `${AdminAPI.DASHBOARD.UPCOMING_DEPARTURES}?days=${days}&limit=${limit}`,
    );
    return data;
  },

  getRevenueChart: async (days: number = 30) => {
    const { data } = await api.get<ApiResponse<RevenueChartData[]>>(`${AdminAPI.DASHBOARD.REVENUE_CHART}?days=${days}`);
    return data;
  },

  getTopDestinations: async (limit: number = 5) => {
    const { data } = await api.get<ApiResponse<TopDestination[]>>(
      `${AdminAPI.DASHBOARD.TOP_DESTINATIONS}?limit=${limit}`,
    );
    return data;
  },

  getRecentBookings: async (limit: number = 10) => {
    const { data } = await api.get<ApiResponse<RecentBooking[]>>(
      `${AdminAPI.DASHBOARD.RECENT_BOOKINGS}?limit=${limit}`,
    );
    return data;
  },
};
