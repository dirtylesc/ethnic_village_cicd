import { omitBy } from 'lodash';

import { ArticleListRequest } from '@/types/article.type';

import { useQueryConfig } from '../use-query-config';
import { useArticleList } from '../useArticle';
import { useTagList } from './useTag';

type EntityWithId = {
  id: string;
  slug?: string;
};

const getFilterIds = <T extends EntityWithId>(
  queryValue: string | string[] | undefined,
  entities: T[] | undefined,
  getMatchValue: (entity: T) => string,
): string[] => {
  if (!queryValue || !entities) return [];

  const values = Array.isArray(queryValue) ? queryValue : [queryValue];

  return Array.from(
    new Set(
      values.map(value => entities.find(e => getMatchValue(e) === value)?.id).filter((id): id is string => Boolean(id)),
    ),
  );
};

export const useFilteredArticleList = (pageSize: number = 10) => {
  const queryConfig = useQueryConfig();
  const { data: tagRes } = useTagList();
  const tags = tagRes?.data || [];

  const filterParams: ArticleListRequest = omitBy(
    {
      page: queryConfig.page || 0,
      size: pageSize,
      tagIds: getFilterIds(queryConfig.t, tags, tag => tag.slug).join(','),
      searchKey: queryConfig.search,
      order: queryConfig.order,
      sortBy: queryConfig.sort_by,
    },
    (v, k) => {
      return v === undefined || v === null || v === '';
    },
  );

  const { data, isLoading } = useArticleList(filterParams);

  return {
    articles: data?.data?.content || [],
    totalPages: data?.data?.totalPages || 0,
    totalElements: data?.data?.totalElements || 0,
    isLoading,
  };
};
