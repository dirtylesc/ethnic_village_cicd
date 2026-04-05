'use client';

import { FilterItem, FILTERS } from '@/data/mocks/filters';

import { useTagList } from '@/hooks/api/useTag';
import FilterCardGroup from '@/components/shared/filter-card/filter-card-group';

export default function ArticleFilterSection() {
  const { data: tagRes } = useTagList();
  const tagItems: FilterItem[] =
    tagRes?.data.map(t => ({
      label: t.name,
      value: t.slug,
      id: t.id,
    })) || [];

  const modifiedFilters = {
    tags: {
      ...FILTERS.tags,
      items: tagItems,
      isTranslated: true,
    },
  };

  return (
    <div className="w-full md:w-64">
      <div className="flex flex-col gap-4">
        <FilterCardGroup filters={Object.values(modifiedFilters)} />
      </div>
    </div>
  );
}
