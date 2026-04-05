'use client';

import * as React from 'react';
import { TourStatusEnum } from '@/core/enum/tour.enum';
import type { Table } from '@tanstack/react-table';
import { CheckCircle2, Download, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { exportTableToCSV } from '@/libs/export';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/shared/data-table/data-table-action-bar';

const actions = ['update-status', 'update-priority', 'export', 'delete'] as const;

type Action = (typeof actions)[number];

type ToursTableActionBarProps = {
  table: Table<Tour>;
}

export function ToursTableActionBar({ table }: ToursTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const t = useTranslations('admin');
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onTourUpdate = () => {};

  const onTourExport = React.useCallback(() => {
    setCurrentAction('export');
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ['select', 'actions'],
        onlySelected: true,
      });
    });
  }, [table]);

  const onTourDelete = () => {};

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator orientation="vertical" className="hidden data-[orientation=vertical]:h-5 sm:block" />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: Tour['status']) => onTourUpdate()}
        >
          <DataTableActionBarAction
            asChild
            size="icon"
            tooltip={t('tour.list.update_status')}
            isPending={getIsActionPending('update-status')}
          >
            <SelectTrigger className="min-w-fit">
              <CheckCircle2 />
            </SelectTrigger>
          </DataTableActionBarAction>
          <SelectContent align="center">
            <SelectGroup>
              {Object.values(TourStatusEnum).map(status => (
                <SelectItem key={status.value} value={status.value} className="capitalize">
                  {t(status.value as any)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip={t('tour.list.export_tasks')}
          isPending={getIsActionPending('export')}
          onClick={onTourExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip={t('tour.list.delete_tasks')}
          isPending={getIsActionPending('delete')}
          onClick={onTourDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
