'use client';

import React from 'react';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { TourStatusEnum } from '@/core/enum/tour.enum';
import { splitDateStr } from '@/utils/date';
import { formatCurrency, findBestDirectDiscountPromotion } from '@/utils/number';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tour } from '@/types/tour.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';

type GetTourTableColumnsProps = {
  setRowAction: React.Dispatch<
    React.SetStateAction<{
      id: number | string;
      action: 'edit' | 'delete' | 'status' | 'assign';
      row?: Tour;
    } | null>
  >;
  t: ReturnType<typeof useTranslations>;
}

export function getTourTableColumns({ setRowAction, t }: GetTourTableColumnsProps): ColumnDef<Tour>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: 'image',
      header: () => null,
      cell: ({ row }) => {
        const tour = row.original;
        return (
          <div className="flex min-w-[48px] items-center justify-center">
            <img
              src={tour.imageUrl}
              alt={tour.title || 'Tour image'}
              className="h-10 w-10 rounded-md border object-cover"
              width={40}
              height={40}
              loading="lazy"
            />
          </div>
        );
      },
      enableSorting: false,
      size: 48,
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.list.tour')} />,
      cell: ({ row }) => {
        const tour = row.original;
        const cities = tour.locations?.map(loc => loc.city).join(' - ');
        const duration = tour.duration
          ? `${tour.duration} ${t('tour.list.day')} ${tour.duration - 1} ${t('tour.list.night')}`
          : '';
        return (
          <div className="min-w-[220px]">
            <div className="mb-1 line-clamp-2 text-base font-semibold">
              {tour.title || <span className="italic text-gray-400">({t('tour.list.no_title')})</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
              {cities && <Badge variant="default">{cities}</Badge>}
              {tour.duration && <Badge variant="green">{duration}</Badge>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'ethnics',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.list.ethnic')} />,
      cell: ({ row }) => (
        <div className="flex min-w-[120px] flex-wrap gap-2">
          {row.original.ethnics?.map(ethnic => (
            <Badge key={ethnic.id} variant="outline" className="bg-gray-100">
              {ethnic.name}
            </Badge>
          ))}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'rating',
      accessorKey: 'avgRating',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.list.rating')} />,
      cell: ({ row }) => (
        <div className="flex min-w-[100px] items-center gap-1">
          <Star className="mr-1 h-4 w-4 fill-yellow-300 text-yellow-400" aria-label={t('tour.list.average_rating')} />
          <span className="font-medium">{row.original.avgRating?.toFixed(1) ?? '0.0'}</span>
          <span className="text-xs text-gray-500">({row.original.ratingCount ?? 0})</span>
        </div>
      ),
      enableSorting: true,
      sortingFn: (a, b) => (a.original.avgRating || 0) - (b.original.avgRating || 0),
    },
    {
      id: 'price',
      accessorKey: 'adultPrice',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.list.price')} />,
      cell: ({ row }) => {
        const tour = row.original;
        const promo = findBestDirectDiscountPromotion(tour.promotions);
        return (
          <div className="flex min-w-[140px] flex-col gap-1">
            <div>
              <span className="mr-1 text-xs text-gray-500">{t('tour.list.adult')}:</span>
              {promo ? (
                <>
                  <span className="mr-1 text-gray-400 line-through">{formatCurrency(tour.adultPrice)}</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(tour.adultPrice, {
                      discount_percent: promo.discountPercent,
                      max_discount_amount: promo.maxDiscountAmount,
                    })}
                  </span>
                </>
              ) : (
                <span className="font-semibold">{formatCurrency(tour.adultPrice)}</span>
              )}
            </div>
            <div>
              <span className="mr-1 text-xs text-gray-500">{t('tour.list.child')}:</span>
              {promo ? (
                <>
                  <span className="mr-1 text-gray-400 line-through">{formatCurrency(tour.childPrice)}</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(tour.childPrice, {
                      discount_percent: promo.discountPercent,
                      max_discount_amount: promo.maxDiscountAmount,
                    })}
                  </span>
                </>
              ) : (
                <span className="font-semibold">{formatCurrency(tour.childPrice)}</span>
              )}
            </div>
          </div>
        );
      },
      enableSorting: true,
      sortingFn: (a, b) => (a.original.adultPrice || 0) - (b.original.adultPrice || 0),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader className="min-w-[120px]" column={column} title={t('tour.list.status')} />
      ),
      cell: ({ row }) => {
        const statusInfo = Object.values(TourStatusEnum).find(s => s.value === row.original.status);
        return statusInfo ? (
          <Badge variant={statusInfo.variant}>{t(('status.' + statusInfo.value) as any)}</Badge>
        ) : null;
      },
    },
    {
      accessorKey: 'publishedAt',
      header: ({ column }) => (
        <DataTableColumnHeader className="min-w-[120px]" column={column} title={t('tour.list.published_utc')} />
      ),
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.publishedAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'start_date',
      header: ({ column }) => (
        <DataTableColumnHeader className="min-w-[120px]" column={column} title={t('tour.list.created_utc')} />
      ),
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.createdAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
    },
    {
      accessorKey: 'end_date',
      header: ({ column }) => (
        <DataTableColumnHeader className="min-w-[120px]" column={column} title={t('tour.list.updated_utc')} />
      ),
      cell: ({ row }) => {
        const [date, time] = splitDateStr(row.original.updatedAt);
        return (
          <div className="whitespace-pre">
            {date}
            {'\n'}
            {time}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const tour = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('tour.list.open_menu')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRowAction({ id: tour.id, action: 'edit', row: tour })}>
                <Link href={RouteConstant.admin_tour_edit.replace(':id', String(tour.id))}>{t('tour.list.edit')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRowAction({ id: tour.id, action: 'status', row: tour })}>
                {t('tour.list.change_status')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setRowAction({ id: tour.id, action: 'delete', row: tour })}
                className="text-destructive"
              >
                {t('tour.list.delete')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRowAction({ id: tour.id, action: 'assign', row: tour })}>
                Chọn người dẫn tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
