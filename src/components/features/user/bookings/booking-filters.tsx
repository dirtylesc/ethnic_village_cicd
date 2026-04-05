'use client';

import { useState } from 'react';
import { BookingStatus } from '@/core/enum/booking.enum';
import { cn } from '@/utils/classnames';
import { format, parse, startOfDay } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useBookingQueryConfig } from '@/hooks/use-query-config';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type BookingFiltersProps = {
  onFilterChange: (filters: Partial<BookingListRequest>) => void;
  showStatusFilter?: boolean;
}

const FILTER_BOOKING_STATUS = Object.values(BookingStatus);

export default function BookingFilters({ onFilterChange, showStatusFilter = true }: BookingFiltersProps) {
  const t = useTranslations('personal.transaction');
  const queryConfig = useBookingQueryConfig();

  const startDateStr = queryConfig.start_date as string | undefined;
  const endDateStr = queryConfig.end_date as string | undefined;

  const initialStatuses = queryConfig.status
    ? (queryConfig.status as string[]).map(status => status as BookingStatus)
    : [];

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    return startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    return endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [selectedStatuses, setSelectedStatuses] = useState<BookingStatus[]>(initialStatuses);
  const [statusesOpen, setStatusesOpen] = useState(false);

  const statusOptions = FILTER_BOOKING_STATUS.map(status => {
    const statusKey = status === BookingStatus.PENDING_PAYMENT ? 'expired_payment' : status.toLowerCase();
    return {
      value: status,
      label: t(`status.${statusKey}` as any),
    };
  });

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      onFilterChange({ startDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      onFilterChange({ startDate: undefined });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      onFilterChange({ endDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      onFilterChange({ endDate: undefined });
    }
  };

  const handleStatusChange = (status: BookingStatus) => {
    let newStatuses: BookingStatus[];

    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }

    setSelectedStatuses(newStatuses);

    onFilterChange({ status: newStatuses.length > 0 ? newStatuses : undefined });
  };

  const clearFilters = () => {
    setStartDate(startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined);
    setEndDate(endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined);
    setSelectedStatuses([]);
    onFilterChange({
      startDate: startDateStr,
      endDate: endDateStr,
      status: undefined,
    });
  };

  const hasActiveFilters = startDate || endDate || selectedStatuses.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t('filters.title') || 'Search Filters'}</h3>
            <p className="text-xs text-muted-foreground">{t('filters.subtitle') || 'Filter by date and status'}</p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="group/btn flex items-center gap-1.5 rounded-md text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-rotate-180" />
            <span>{t('filters.clear')}</span>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        
        <div className="flex-1 min-w-[260px]">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            {t('filters.date_range')}
          </label>
          <div className="flex items-center gap-2">
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-9 flex-1 justify-start rounded-md border-border px-3 text-left text-xs font-normal',
                    startDate && 'border-primary/50 bg-primary/5 text-foreground',
                    !startDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate">
                    {startDate ? format(startDate, 'dd/MM/yyyy') : t('filters.start_date')}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto rounded-lg border-border p-0 shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>

            <div className="h-px w-2 bg-border" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-9 flex-1 justify-start rounded-md border-border px-3 text-left text-xs font-normal',
                    endDate && 'border-primary/50 bg-primary/5 text-foreground',
                    !endDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  <span className="truncate">{endDate ? format(endDate, 'dd/MM/yyyy') : t('filters.end_date')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto rounded-lg border-border p-0 shadow-lg" align="start">
                <Calendar mode="single" selected={endDate} onSelect={handleEndDateChange} initialFocus className="rounded-lg" />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {showStatusFilter && (
          <div className="min-w-[180px]">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              {t('filters.status')}
            </label>
            <Popover open={statusesOpen} onOpenChange={setStatusesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={statusesOpen}
                  className={cn(
                    'h-9 w-full justify-between rounded-md border-border px-3 text-xs font-normal',
                    selectedStatuses.length > 0 && 'border-primary/50 bg-primary/5',
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {selectedStatuses.length > 0 ? (
                      <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                          {selectedStatuses.length}
                        </span>
                        <span className="text-foreground">{t('filters.selected')}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{t('filters.all_statuses')}</span>
                    )}
                  </span>
                  <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] rounded-lg border-border p-0 shadow-lg">
                <Command className="rounded-lg">
                  <CommandInput
                    placeholder={t('filters.search_status')}
                    className="border-0 text-xs focus:ring-0"
                  />
                  <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                    {t('filters.no_results')}
                  </CommandEmpty>
                  <CommandGroup className="p-1.5">
                    {statusOptions.map(status => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={() => handleStatusChange(status.value)}
                        className="cursor-pointer rounded-md px-2.5 py-2 text-xs"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded border transition-all',
                            selectedStatuses.includes(status.value)
                              ? 'border-primary bg-primary'
                              : 'border-border bg-card',
                          )}
                        >
                          <Check
                            className={cn(
                              'h-2.5 w-2.5 text-white transition-opacity',
                              selectedStatuses.includes(status.value) ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </div>
                        <span className="font-medium">{status.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}
