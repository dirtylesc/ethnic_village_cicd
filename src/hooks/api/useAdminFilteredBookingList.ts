import { BookingStatus } from '@/core/enum/booking.enum';
import { bookingAdminApi } from '@/data/apis/booking.admin.api';
import { useQuery } from '@tanstack/react-query';
import { omitBy } from 'lodash';

import { AdminBookingListRequest } from '@/types/booking/booking.admin';

import { useAdminBookingQueryConfig } from '../use-query-config';

export const useAdminFilteredBookingList = (pageSize: number = 10) => {
  const queryConfig = useAdminBookingQueryConfig();

  const baseParams = {
    page: queryConfig.page ? Number(queryConfig.page) - 1 : 0,
    size: pageSize,
    tourId: queryConfig.tourId,
    tourAvailableDateIds: queryConfig.tourAvailableDateIds,
    status: queryConfig.status as BookingStatus[],
    fromDate: queryConfig.start_date,
    toDate: queryConfig.end_date,
    sortBy: queryConfig.sort_by,
    order: queryConfig.order as 'asc' | 'desc',
  };

  const filteredParams = omitBy(
    baseParams,
    (v, k) => {
      if (k === 'page' || k === 'size') return false;
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0);
    },
  ) as Omit<AdminBookingListRequest, 'page' | 'size'>;

  const filterParams: AdminBookingListRequest = {
    ...filteredParams,
    page: baseParams.page,
    size: baseParams.size,
  };

  const {
    data: bookingRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-bookings', filterParams],
    queryFn: () => bookingAdminApi.getAdminBookingList(filterParams),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  return {
    bookings: bookingRes?.data?.content || [],
    totalPages: bookingRes?.data?.totalPages || 0,
    totalElements: bookingRes?.data?.totalElements || 0,
    isLoading,
    error: error?.message || null,
  };
};
