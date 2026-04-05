'use client';

import React from 'react';
import Link from 'next/link';
import { RouteConstant } from '@/core/constants/route';
import { TourAvailableDateStatusEnum } from '@/core/enum/tour.enum';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarDays, Clock, History, MapPin, MoreHorizontal, RefreshCw, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDateResponse } from '@/types/tour-assignment.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DataTableColumnHeader } from '@/components/shared/data-table/data-table-column-header';

type GetAssignedAvailableDatesTableColumnsProps = {
  t: ReturnType<typeof useTranslations>;
  isAdmin: boolean;
  setRowAction?: React.Dispatch<
    React.SetStateAction<{
      id: string;
      action: 'cancel' | 'history' | 'update-status';
      row?: AssignedAvailableDateResponse;
    } | null>
  >;
};

export function getAssignedAvailableDatesTableColumns({
  t,
  isAdmin,
  setRowAction,
}: GetAssignedAvailableDatesTableColumnsProps): ColumnDef<AssignedAvailableDateResponse>[] {
  const calculateBookedSlots = (bookedPersonCounts: { adult: number; child: number }[]) => {
    if (!bookedPersonCounts || bookedPersonCounts.length === 0) return 0;
    return bookedPersonCounts.reduce((total, booking) => {
      return total + (booking.adult || 0) + (booking.child || 0);
    }, 0);
  };

  const columns: ColumnDef<AssignedAvailableDateResponse>[] = [
    {
      id: 'title',

      accessorFn: row => row.tour?.title,
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.assigned_dates.tour')} />,
      cell: ({ row }) => {
        const assignment = row.original;
        const tour = assignment.tour;
        const duration = tour.duration
          ? t('tour.assigned_dates.duration', { days: tour.duration, nights: tour.duration - 1 })
          : '';

        return (
          <div className="min-w-[200px]">
            <div className="flex items-start gap-3">
              <img
                src={tour.imageUrl}
                alt={tour.title || 'Tour image'}
                className="h-12 w-12 rounded-md border object-cover"
                width={48}
                height={48}
                loading="lazy"
              />
              <div className="flex-1">
                <Link
                  href={`${RouteConstant.admin_tour}/${tour.id}`}
                  className="mb-1 line-clamp-2 text-sm font-semibold hover:text-primary"
                >
                  {tour.title || <span className="italic text-gray-400">({t('tour.assigned_dates.no_title')})</span>}
                </Link>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {duration && (
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {duration}
                    </Badge>
                  )}
                  {tour?.pickUpLocation && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {tour?.pickUpLocation?.address && tour.pickUpLocation.address + ', '}
                            {tour?.pickUpLocation?.city || t('tour.assigned_dates.not_available')}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {t('tour.assigned_dates.pickup_location')}:{' '}
                            {tour?.pickUpLocation?.address && tour.pickUpLocation.address + ', '}
                            {tour?.pickUpLocation?.city || t('tour.assigned_dates.not_available')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'startDate',

      accessorFn: row => row.tourAvailableDate?.startDate,
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.assigned_dates.available_date')} />,
      cell: ({ row }) => {
        const assignment = row.original;
        const availableDate = assignment.tourAvailableDate;
        const startDate = format(new Date(availableDate.startDate), 'dd/MM/yyyy');
        const endDate = format(new Date(availableDate.endDate), 'dd/MM/yyyy');
        const isMultiDay = availableDate.startDate !== availableDate.endDate;
        const bookedSlots = calculateBookedSlots(availableDate.bookedPersonCounts);

        return (
          <div className="min-w-[120px]">
            <div className="flex items-center gap-1 text-sm font-medium">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              {isMultiDay ? `${startDate} - ${endDate}` : startDate}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {t('tour.assigned_dates.booked_slots', { count: `${bookedSlots}/${availableDate.maxSlots}` })}
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'assignedDate',
      accessorKey: 'assignedDate',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.assigned_dates.assigned_date')} />,
      cell: ({ row }) => {
        const assignment = row.original;

        if (!assignment.assignedDate) {
          return (
            <div className="min-w-[100px]">
              <div className="text-sm font-medium text-muted-foreground">N/A</div>
              <div className="text-xs text-muted-foreground">
                {t('tour.assigned_dates.assigned_by')} {assignment.assignedBy}
              </div>
            </div>
          );
        }

        try {
          const assignedDate = format(new Date(assignment.assignedDate), 'dd/MM/yyyy HH:mm');
          return (
            <div className="min-w-[100px]">
              <div className="text-sm font-medium">{assignedDate}</div>
              <div className="text-xs text-muted-foreground">
                {t('tour.assigned_dates.assigned_by')} {assignment.assignedBy}
              </div>
            </div>
          );
        } catch (error) {
          return (
            <div className="min-w-[100px]">
              <div className="text-sm font-medium text-muted-foreground">Invalid date</div>
              <div className="text-xs text-muted-foreground">
                {t('tour.assigned_dates.assigned_by')} {assignment.assignedBy}
              </div>
            </div>
          );
        }
      },
    },
    {
      id: 'status',

      accessorFn: row => row.tourAvailableDate?.status,
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('tour.assigned_dates.status')} />,
      cell: ({ row }) => {
        const assignment = row.original;
        const status = assignment.tourAvailableDate.status;

        return (
          <Badge variant={TourAvailableDateStatusEnum[status].variant}>{t(`available_date_status.${status}`)}</Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      id: 'guide',
      accessorFn: row =>
        row.guide?.personal ? `${row.guide.personal.firstName} ${row.guide.personal.lastName}` : undefined,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('tour.assigned_dates.assigned_employee')} />
      ),
      cell: ({ row }) => {
        const assignment = row.original;
        const employee = assignment.guide;

        if (!employee) {
          return <span className="text-xs text-muted-foreground">{t('tour.assigned_dates.no_employee')}</span>;
        }

        return (
          <div className="min-w-[120px]">
            <div className="text-sm font-medium">
              {employee.personal
                ? `${employee.personal.firstName} ${employee.personal.lastName}`
                : t('tour.assigned_dates.not_available')}
            </div>
            <div className="text-xs text-muted-foreground">{employee.email}</div>
          </div>
        );
      },
    });
  }
  return columns;
}
