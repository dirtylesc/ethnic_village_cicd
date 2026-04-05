import type * as React from 'react';
import { getCommonPinningStyles } from '@/libs/data-table';
import { cn } from '@/utils';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';

export type DataTableProps<TData> = {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  loading?: boolean;
} & React.ComponentProps<'div'>

export function DataTable<TData>({ table, actionBar, children, className, loading, ...props }: DataTableProps<TData>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      data-loading={loading ? 'true' : undefined}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
