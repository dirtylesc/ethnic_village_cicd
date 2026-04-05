'use client';

import { FilterItem, FILTERS } from '@/data/mocks/filters';

import { useEthnicList } from '@/hooks/api/useEthnic';
import { useLocationList } from '@/hooks/api/useLocation';
import { useTagList } from '@/hooks/api/useTag';
import FilterCardGroup from '@/components/shared/filter-card/filter-card-group';

import PriceFilterCard from '../filter-card/price-filter-card';

export default function FilterSection() {
  const { data: locationRes } = useLocationList();
  const uniqueLocations =
    locationRes?.data && locationRes.data.length > 0
      ? Array.from(new Map(locationRes.data.map(location => [location.city, location])).values())
      : [];
  const locationItems: FilterItem[] =
    uniqueLocations.map(location => ({
      label: location.city,
      value: location.city,
      id: location.city,
    })) || [];

  const { data: ethnicRes } = useEthnicList();
  const ethnicItems: FilterItem[] =
    ethnicRes?.data.map(e => ({
      label: e.name,
      value: e.code,
      id: e.id,
    })) || [];

  const { data: tagRes } = useTagList();
  const tagItems: FilterItem[] =
    tagRes?.data.map(t => ({
      label: t.name,
      value: t.slug,
      id: t.id,
    })) || [];

  const modifiedFilters = {
    ...FILTERS,
    location: {
      ...FILTERS.location,
      items: locationItems,
      isTranslated: true,
    },
    ethnic: {
      ...FILTERS.ethnic,
      items: ethnicItems,
      isTranslated: true,
    },
    tags: {
      ...FILTERS.tags,
      items: tagItems,
      isTranslated: true,
    },
  };

  return (
    <div className="w-full md:w-64">
      <div className="flex flex-col gap-4">
        <PriceFilterCard />
        <FilterCardGroup filters={Object.values(modifiedFilters)} />
      </div>
    </div>
  );
}
