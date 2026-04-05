'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { useAdminFilteredTourList } from '@/hooks/api/useAdminFilteredTourList';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryConfig } from '@/hooks/use-query-config';
import { DataTable, DataTableProps } from '@/components/shared/data-table/data-table';
import { DataTableViewOptions } from '@/components/shared/data-table/data-table-view-options';

import { TourAssignmentDialog } from './tour-assignment-dialog';
import DeleteTourDialog from './tour-delete-dialog';
import { ToursTableActionBar } from './tour-table-action-bar';
import { getTourTableColumns } from './tour-table-columns';
import { TourTableFilter } from './tour-table-filter';

export function ToursTable() {
  const queryConfig = useQueryConfig();
  const t = useTranslations('admin');

  const { tours, totalPages, isLoading } = useAdminFilteredTourList(queryConfig.perPage || 10);

  const [rowAction, setRowAction] = React.useState<{
    id: string | number;
    action: 'edit' | 'delete' | 'status' | 'assign';
    row?: Tour;
  } | null>(null);

  const columns = React.useMemo(
    () =>
      getTourTableColumns({
        setRowAction,
        t,
      }),
    [],
  );

  const { table } = useDataTable<Tour>({
    data: tours,
    columns,
    pageCount: totalPages,
    initialState: {
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow: any) => originalRow?.tourId ?? originalRow?.id?.toString() ?? String(Math.random()),
    shallow: false,
    clearOnDefault: true,
  });

  const dataTableProps: Partial<DataTableProps<Tour>> = {
    loading: isLoading ?? false,
  };

  return (
    <>
      <DataTable {...dataTableProps} table={table} actionBar={<ToursTableActionBar table={table} />}>
        <div className="flex w-full items-start justify-between gap-2 p-1">
          <TourTableFilter
            key={JSON.stringify({ search: queryConfig.search, status: queryConfig.status, e: queryConfig.e })}
          />
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </DataTable>
      
      <DeleteTourDialog
        open={rowAction?.action === 'delete'}
        onOpenChange={() => setRowAction(null)}
        tours={rowAction?.row ? [rowAction.row] : []}
        showTrigger={false}
        onSuccess={() => {

          setRowAction(null);
        }}
      />
      <TourAssignmentDialog
        tour={rowAction?.row}
        open={rowAction?.action === 'assign'}
        onOpenChange={open => {
          if (!open) {
            setRowAction(null);
          }
        }}
      />
    </>
  );
}
