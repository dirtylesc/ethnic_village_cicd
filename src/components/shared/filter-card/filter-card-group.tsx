'use client';

import { FilterConfig } from '@/data/mocks/filters';

import { FilterCard } from './filter-card';

type FilterCardGroupProps = {
  filters: FilterConfig[];
}

const FilterCardGroup = ({ filters }: FilterCardGroupProps) => {
  return (
    <div className="flex flex-col gap-4">
      {filters.map((filter, index) => (
        <FilterCard key={index} filter={filter} isTranslated={filter.isTranslated} />
      ))}
    </div>
  );
};

export default FilterCardGroup;
