import { Suspense } from 'react';

import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton';
import { Shell } from '@/components/shared/shell';

import { BookingListHeader } from './components/booking-list-header';
import BookingTable from './components/booking-table';

export default function AdminBookingListContent() {
  return (
    <div className="p-6">
      <BookingListHeader />
      <Shell className="gap-2">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={9}
              filterCount={4}
              cellWidths={['8rem', '12rem', '15rem', '8rem', '10rem', '8rem', '10rem', '10rem', '8rem']}
              shrinkZero
            />
          }
        >
          <BookingTable />
        </Suspense>
      </Shell>
    </div>
  );
}
