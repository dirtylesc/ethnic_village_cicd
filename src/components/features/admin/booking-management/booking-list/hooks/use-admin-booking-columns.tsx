import { formatCurrency } from '@/utils/number';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Eye, MoreHorizontal, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { AdminBooking } from '@/types/booking/booking.admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';

export function useAdminBookingColumns(): ColumnDef<AdminBooking>[] {
  const t = useTranslations('admin');

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'bookingId',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.booking_id')} />,
      cell: ({ row }) => <div className="min-w-[150px] font-mono text-sm">{row.original.bookingId}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'tour.title',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.tour_title')} />,
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="line-clamp-2 text-sm font-medium" title={row.original.tour?.title}>
            {row.original.tour?.title || '-'}
          </div>
        </div>
      ),
      enableSorting: true,
    },

    {
      accessorKey: 'tourAvailableDate.startDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.tour_date')} />,
      cell: ({ row }) => {
        const booking = row.original;
        const { startDate, endDate } = booking.tourAvailableDate;

        if (!startDate || !endDate) {
          return <div className="text-sm text-muted-foreground">-</div>;
        }

        try {
          const start = new Date(startDate);
          const end = new Date(endDate);

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return <div className="text-sm text-muted-foreground">-</div>;
          }

          return (
            <div className="min-w-[120px] text-sm">
              <div>{format(start, 'dd/MM/yyyy', { locale: vi })}</div>
              {startDate !== endDate && (
                <div className="text-xs text-muted-foreground">→ {format(end, 'dd/MM/yyyy', { locale: vi })}</div>
              )}
            </div>
          );
        } catch (error) {
          return <div className="text-sm text-muted-foreground">-</div>;
        }
      },
      enableSorting: true,
    },
    {
      accessorKey: 'bookerDetail',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.booker')} />,
      cell: ({ row }) => {
        const { bookerDetail } = row.original;
        return (
          <div className="min-w-[200px]">
            <div className="font-medium">{bookerDetail.name}</div>
            <div className="text-xs text-muted-foreground">{bookerDetail.email}</div>
            <div className="text-xs text-muted-foreground">{bookerDetail.phone}</div>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'personCount',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.participants')} />,
      cell: ({ row }) => {
        const booking = row.original;
        const { adult, child } = booking.personCount;
        return (
          <div className="min-w-[120px] text-sm">
            <div className="text-xs text-muted-foreground">Người lớn: {adult}</div>
            <div className="text-xs text-muted-foreground">Trẻ em: {child}</div>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.total_price')} />,
      cell: ({ row }) => {
        const booking = row.original;
        const totalPrice = booking.totalPrice;
        const discountAmount = booking.discountAmountApplied || 0;
        const originalPrice = totalPrice + discountAmount;
        const hasDiscount = discountAmount > 0;

        return (
          <div className="min-w-[120px] text-right">
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">{formatCurrency(originalPrice)}</div>
            )}
            <div className={`font-medium ${hasDiscount ? 'text-green-600' : ''}`}>{formatCurrency(totalPrice)}</div>
            {hasDiscount && <div className="text-xs text-green-600">Giảm {formatCurrency(discountAmount)}</div>}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('booking.list.table.status')} />,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;

        const statusConfig = {
          PENDING_PAYMENT: { variant: 'secondary' as const, color: 'text-yellow-700 bg-yellow-100' },
          FAILED_PAYMENT: { variant: 'destructive' as const, color: 'text-red-700 bg-red-100' },
          PAID: { variant: 'default' as const, color: 'text-green-700 bg-green-100' },
          CONFIRMED: { variant: 'default' as const, color: 'text-blue-700 bg-blue-100' },
          IN_PROGRESS: { variant: 'secondary' as const, color: 'text-purple-700 bg-purple-100' },
          CANCELLED_BY_USER: { variant: 'destructive' as const, color: 'text-red-700 bg-red-100' },
          CANCELLED_BY_ADMIN: { variant: 'destructive' as const, color: 'text-red-700 bg-red-100' },
          COMPLETED: { variant: 'default' as const, color: 'text-green-700 bg-green-100' },
          REFUNDED: { variant: 'secondary' as const, color: 'text-orange-700 bg-orange-100' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_PAYMENT;

        const getStatusText = (status: string) => {
          if (!status) return status;
          return t(('booking.list.status.' + status.toLowerCase()) as any);
        };

        return (
          <div className="min-w-[120px]">
            <Badge variant={config.variant} className={config.color}>
              {getStatusText(status)}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: t('booking.list.table.actions'),
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <div className="min-w-[80px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  {t('booking.list.actions.view_details')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
