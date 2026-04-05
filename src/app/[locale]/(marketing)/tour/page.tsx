'use client';

import TourContentSection from '@/components/features/tour/tour-list/content-section';
import FilterSection from '@/components/features/tour/tour-list/filter-section';
import { SearchBar } from '@/components/features/tour/tour-search';

export default function TourList() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <SearchBar className="w-full rounded-none border-0 shadow-custom-blue" />

      <div className="flex w-full flex-col gap-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FilterSection />
          <TourContentSection />
        </div>
      </div>
    </div>
  );
}
