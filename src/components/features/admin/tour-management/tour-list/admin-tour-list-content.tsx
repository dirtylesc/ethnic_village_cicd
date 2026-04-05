import { Suspense } from 'react';

import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton';
import { Shell } from '@/components/shared/shell';

import { TourListHeader } from './components/tour-list-header';
import { ToursTable } from './components/tour-table';

export default function AdminTourListContent() {
  return (
    <div className="p-6">
      <TourListHeader />
      <Shell className="gap-2">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={['10rem', '30rem', '10rem', '10rem', '6rem', '6rem', '6rem']}
              shrinkZero
            />
          }
        >
          <ToursTable />
        </Suspense>
      </Shell>
    </div>
  );
}
