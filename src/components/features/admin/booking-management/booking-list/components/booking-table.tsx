'use client';

import { useTranslations } from 'next-intl';

import { AdminBooking } from '@/types/booking/booking.admin';
import { useAdminFilteredBookingList } from '@/hooks/api/useAdminFilteredBookingList';
import { useDataTable } from '@/hooks/use-data-table';
import { useAdminBookingQueryConfig } from '@/hooks/use-query-config';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableViewOptions } from '@/components/shared/data-table/data-table-view-options';
import { DataExporter } from '@/components/shared/export';

import { useAdminBookingColumns } from '../hooks/use-admin-booking-columns';
import { useAdminBookingExport } from '../hooks/use-admin-booking-export';
import { BookingTableFilter } from './booking-table-filter';

function BookingTable() {
  const t = useTranslations('admin.booking.list');
  const queryConfig = useAdminBookingQueryConfig();

  const { bookings, totalPages, isLoading, error } = useAdminFilteredBookingList(queryConfig.perPage || 10);

  const { fetchAllBookings, exportColumns } = useAdminBookingExport();

  const { table } = useDataTable<AdminBooking>({
    data: bookings,
    columns: useAdminBookingColumns(),
    pageCount: totalPages,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow: AdminBooking) => originalRow.bookingId,
    shallow: false,
    clearOnDefault: true,
  });

  if (error) {
    return (
      <div className="space-y-4">
        <BookingTableFilter />
        <div className="rounded-md border border-destructive/20 p-6 text-center">
          <div className="mb-2 font-medium text-destructive">Lỗi tải dữ liệu</div>
          <div className="mb-4 text-sm text-muted-foreground">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="hover:bg-primary/90 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTable table={table} loading={isLoading ?? false}>
        <div className="flex w-full items-start justify-between gap-2 p-1">
          <BookingTableFilter />
          <div className="flex items-center gap-2">
            <DataExporter
              title={t('export_title') || 'Danh sách Booking'}
              columns={exportColumns}
              onFetchAllData={fetchAllBookings}
              currentFilters={queryConfig}
              className="h-8"
            />
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </DataTable>

      {!isLoading && bookings.length === 0 && (
        <div className="py-8 text-center">
          <div className="text-muted-foreground">
            {Object.values(queryConfig).some(value => value && (Array.isArray(value) ? value.length > 0 : true))
              ? 'Không tìm thấy booking nào với bộ lọc hiện tại'
              : 'Chưa có booking nào'}
          </div>
        </div>
      )}
    </>
  );
}

export default BookingTable;
