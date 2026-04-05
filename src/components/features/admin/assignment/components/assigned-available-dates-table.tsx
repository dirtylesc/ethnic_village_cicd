'use client';

import { useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDateResponse } from '@/types/tour-assignment.type';
import { useAssignedAvailableDates } from '@/hooks/api/useTourAssignment';
import { useDataTable } from '@/hooks/use-data-table';
import { useQueryConfig } from '@/hooks/use-query-config';
import { DataTable, DataTableProps } from '@/components/shared/data-table/data-table';
import { DataTableViewOptions } from '@/components/shared/data-table/data-table-view-options';

import { getAssignedAvailableDatesTableColumns } from './assigned-available-dates-table-columns';
import { AssignedAvailableDatesTableFilter } from './assigned-available-dates-table-filter';
import { AssignmentHistoryDialog } from './assignment-history-dialog';
import { TourStatusUpdateDialog } from './tour-status-update-dialog';

export function AssignedAvailableDatesTable() {
  const queryConfig = useQueryConfig();
  const t = useTranslations('admin');
  const { user } = useAuthStore();
  const isAdmin =
    user?.roles?.some(role => {
      const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, '');
      return normalizedRole === 'ADMIN';
    }) ?? false;

  const [rowAction, setRowAction] = useState<{
    id: string;
    action: 'cancel' | 'history' | 'update-status';
    row?: AssignedAvailableDateResponse;
  } | null>(null);

  const requestParams = useMemo(() => {
    const page = typeof queryConfig.page === 'number' && queryConfig.page > 0 ? queryConfig.page - 1 : 0;

    const params = {
      page,
      size: typeof queryConfig.perPage === 'number' ? queryConfig.perPage : 10,
      sortBy: (queryConfig.sort_by as string) || 'assignedDate',
      order: (queryConfig.order as 'asc' | 'desc') || 'desc',
    } as any;

    if (queryConfig.search) {
      params.searchKey = queryConfig.search as string;
    }
    if (queryConfig.status) {
      const statusArray = Array.isArray(queryConfig.status) ? queryConfig.status : [queryConfig.status as string];
      params.tourStatus = statusArray;
    }

    if (queryConfig.start_date) {
      params.fromDate = queryConfig.start_date as string;
    }
    if (queryConfig.end_date) {
      params.toDate = queryConfig.end_date as string;
    }

    if (isAdmin && queryConfig.employee_ids) {
      const employeeIdsArray = Array.isArray(queryConfig.employee_ids)
        ? queryConfig.employee_ids
        : [queryConfig.employee_ids as string];
      params.employeeIds = employeeIdsArray;
    }

    return params;
  }, [queryConfig, isAdmin]);

  const { data, isLoading, error } = useAssignedAvailableDates(requestParams);

  const assignedDates = useMemo(() => {
    if (!data || !data.data || !Array.isArray(data.data.content)) {
      return [];
    }
    return data.data.content;
  }, [data]);

  const totalPages = useMemo(() => {
    if (!data || !data.data || typeof data.data.totalPages !== 'number') {
      return 0;
    }
    return data.data.totalPages;
  }, [data]);

  const columns = useMemo(
    () =>
      getAssignedAvailableDatesTableColumns({
        t,
        isAdmin,
        setRowAction,
      }),
    [t, isAdmin],
  );

  const { table } = useDataTable<AssignedAvailableDateResponse>({
    data: assignedDates,
    columns,
    pageCount: totalPages,
    initialState: {
      columnPinning: { left: ['tour'] },
    },
    getRowId: (originalRow: AssignedAvailableDateResponse) => {
      return originalRow?.assignmentId || `row-${Math.random().toString(36).substr(2, 9)}`;
    },
    shallow: false,
    clearOnDefault: true,
  });

  const dataTableProps: Partial<DataTableProps<AssignedAvailableDateResponse>> = {
    loading: isLoading ?? false,
  };

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive">{t('tour.assigned_dates.error_loading')}</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTable {...dataTableProps} table={table}>
        <div className="flex w-full items-start justify-between gap-2 p-1">
          <AssignedAvailableDatesTableFilter
            key={JSON.stringify({
              search: queryConfig.search,
              status: queryConfig.status,
              start_date: queryConfig.start_date,
              end_date: queryConfig.end_date,
            })}
          />
          <div className="flex items-center gap-2">
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </DataTable>

      <AssignmentHistoryDialog
        open={rowAction?.action === 'history'}
        onOpenChange={open => {
          if (!open) {
            setRowAction(null);
          }
        }}
        request={
          rowAction?.action === 'history' && rowAction.row
            ? {
                assignmentId: rowAction.row.assignmentId,
                tourAvailableDateId: rowAction.row.tourAvailableDate?.id,
              }
            : null
        }
      />

      <TourStatusUpdateDialog
        open={rowAction?.action === 'update-status'}
        onOpenChange={open => {
          if (!open) {
            setRowAction(null);
          }
        }}
        assignment={rowAction?.action === 'update-status' ? (rowAction.row ?? null) : null}
      />

      {rowAction?.action === 'cancel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">{t('tour.assigned_dates.cancel_confirm_title')}</h3>
            <p className="mb-6 text-sm text-muted-foreground">{t('tour.assigned_dates.cancel_confirm_message')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRowAction(null)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                {t('tour.assigned_dates.cancel')}
              </button>
              <button
                onClick={() => {
                  setRowAction(null);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                {t('tour.assigned_dates.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
