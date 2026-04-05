import { FilterConfig, FILTERS } from '@/data/mocks/filters';
import { omitBy } from 'lodash';

import { TourListRequest } from '@/types/tour.type';

import { useQueryConfig } from '../use-query-config';
import { useFetchEthnics, useFetchLocations } from './useMetaData';
import { useTagList } from './useTag';
import { useTourList } from './useTour';

const getFilterValue = <T>(
  filterConfig: FilterConfig,
  value: string | undefined,
  typeCheck: (value: unknown) => value is T,
): T | undefined => {
  if (!value) return undefined;

  const filterItem = filterConfig.items.find(item => item.value === value);
  if (!filterItem?.apiValue) return undefined;

  return typeCheck(filterItem.apiValue) ? filterItem.apiValue : undefined;
};

type EntityWithId = {
  id: string;
  code?: string;
  city?: string;
  slug?: string;
};

const getFilterIds = <T extends EntityWithId>(
  queryValue: string | string[] | undefined,
  entities: T[] | undefined,
  getMatchValue: (entity: T) => string,
): string[] => {
  if (!queryValue || !entities) return [];

  const values = Array.isArray(queryValue) ? queryValue : [queryValue];

  const ids = values.flatMap(value =>
    entities.filter(entity => getMatchValue(entity) === value).map(entity => entity.id),
  );

  return Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
};

export const useFilteredTourList = (pageSize: number = 12) => {
  const queryConfig = useQueryConfig();
  const { data: ethnics } = useFetchEthnics();
  const { data: locations } = useFetchLocations();
  const { data: tagRes } = useTagList();
  const tags = tagRes?.data || [];

  const filterParams: TourListRequest = omitBy(
    {
      page: queryConfig.page ? Number(queryConfig.page) - 1 : 0,
      size: pageSize,
      ethnicIds: getFilterIds(queryConfig.e, ethnics, ethnic => ethnic.code),
      locationIds: getFilterIds(queryConfig.l, locations, location => location.city),
      tagIds: getFilterIds(queryConfig.t, tags, tag => tag.slug),
      minPrice: queryConfig.min,
      maxPrice: queryConfig.max,
      onSale:
        queryConfig.p && queryConfig.p.length > 0
          ? (Array.isArray(queryConfig.p) ? queryConfig.p : [queryConfig.p]).includes('on_sale')
          : undefined,
      rating: getFilterValue(FILTERS.rating, queryConfig.r, (value): value is number => typeof value === 'number'),
      minDuration: getFilterValue(
        FILTERS.duration,
        queryConfig.d,
        (value): value is { min: number; max?: number } => typeof value === 'object' && value !== null,
      )?.min,
      maxDuration: getFilterValue(
        FILTERS.duration,
        queryConfig.d,
        (value): value is { min: number; max?: number } => typeof value === 'object' && value !== null,
      )?.max,
      searchKey: queryConfig.search,
      date: queryConfig.date,
      order: queryConfig.order,
      sortBy: queryConfig.sort_by,
    },
    v => {
      return v === undefined || v === null || (Array.isArray(v) && v.length === 0);
    },
  );

  const { data: tourRes, isLoading } = useTourList(filterParams);

  return {
    tours: tourRes?.data?.content || [],
    totalPages: tourRes?.data?.totalPages || 0,
    isLoading,
  };
};
