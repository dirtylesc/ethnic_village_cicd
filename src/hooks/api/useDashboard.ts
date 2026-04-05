import { dashboardApi } from '@/data/apis/dashboard.api';
import { useQuery } from '@tanstack/react-query';

import { DashboardStats, RecentBooking, RevenueChartData, TopDestination, UpcomingDeparture } from '@/types/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
    select: response => response.data as DashboardStats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};

export const useUpcomingDepartures = (days: number = 7, limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-departures', days, limit],
    queryFn: () => dashboardApi.getUpcomingDepartures(days, limit),
    select: response => response.data as UpcomingDeparture[],
    staleTime: 60 * 1000,
  });
};

export const useRevenueChart = (days: number = 30) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart', days],
    queryFn: () => dashboardApi.getRevenueChart(days),
    select: response => response.data as RevenueChartData[],
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopDestinations = (limit: number = 5) => {
  return useQuery({
    queryKey: ['dashboard', 'top-destinations', limit],
    queryFn: () => dashboardApi.getTopDestinations(limit),
    select: response => response.data as TopDestination[],
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentBookings = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-bookings', limit],
    queryFn: () => dashboardApi.getRecentBookings(limit),
    select: response => response.data as RecentBooking[],
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
};
