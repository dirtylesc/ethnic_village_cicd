import { isUndefined } from 'lodash';
import omitBy from 'lodash/omitBy';

import { QueryConfig } from '@/types/query.type';

import { useQueryParams } from './use-query-params';

export const useQueryConfig = () => {
  const queryParams = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page,
      status: queryParams.status?.split(',') || [],
      e: queryParams.e?.split(',') || [],
      p: queryParams.p?.split(',') || [],
      l: queryParams.l?.split(',') || [],
      t: queryParams.t?.split(',') || [],
      d: queryParams.d,
      r: queryParams.r,
      min: queryParams.min,
      max: queryParams.max,
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      date: queryParams.date,
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
      employee_ids: queryParams.employee_ids?.split(',') || [],
    },
    isUndefined,
  );

  return queryConfig;
};

export const useBookingQueryConfig = () => {
  const queryParams = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      status: queryParams.status?.split(',') || [],
      e: queryParams.e?.split(',') || [],
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
    },
    isUndefined,
  );

  return queryConfig;
};

export const useAdminBookingQueryConfig = () => {
  const queryParams = useQueryParams();

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page,
      perPage: queryParams.pageSize,
      status: queryParams.status?.split(',') || [],
      tourId: queryParams.tourId,
      tourAvailableDateIds: queryParams.tourAvailableDateIds?.split(',') || [],
      sort_by: queryParams.sort_by || undefined,
      order: queryParams.order || undefined,
      search: queryParams.search,
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
    },
    isUndefined,
  );

  return queryConfig;
};
