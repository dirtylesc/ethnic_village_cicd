import { createParser } from 'nuqs';
import { z } from 'zod';

import { ExtendedColumnSort } from '@/types/data-table';

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: value => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some(item => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: value => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  });
};

export const getSortingStateParserQuery = <TData>(columnIds?: string[] | Set<string>) => {
  const validKeys = columnIds ? (columnIds instanceof Set ? columnIds : new Set(columnIds)) : null;

  return createParser({
    parse: value => {
      if (!value) return [];

      const params = new URLSearchParams(value);
      const sort_by = params.get('sort_by');
      const order = params.get('order');
      if (!sort_by) return [];
      if (validKeys && !validKeys.has(sort_by)) return [];
      return [{ id: sort_by, desc: order === 'desc' }] as ExtendedColumnSort<TData>[];
    },
    serialize: (sorting: ExtendedColumnSort<TData>[]) => {
      if (!sorting || sorting.length === 0) return '';
      const { id, desc } = sorting[0];
      return `sort_by=${encodeURIComponent(id)}&order=${desc ? 'desc' : 'asc'}`;
    },
    eq: (a, b) =>
      a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index]?.desc),
  });
};
