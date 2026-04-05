'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingStatus } from '@/core/enum/booking.enum';
import { bookingAdminApi } from '@/data/apis/booking.admin.api';
import { cn } from '@/utils';
import { format, parse, startOfDay } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import { BookingFilters } from '@/types/booking';
import { TourAvailableDateResponse, TourBasicResponse } from '@/types/booking/booking.admin.response';
import { useAdminBookingQueryConfig } from '@/hooks/use-query-config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MultiSelect } from '@/components/shared/multiple-select';
import { SearchableSelect } from '@/components/shared/searchable-select';

export const BookingTableFilter = () => {
  const t = useTranslations('admin.booking.list.filter');
  const tStatus = useTranslations('admin.booking.list.status');
  const router = useRouter();
  const queryConfig = useAdminBookingQueryConfig();

  const [tours, setTours] = useState<TourBasicResponse[]>([]);
  const [tourDates, setTourDates] = useState<TourAvailableDateResponse[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const startDateStr = queryConfig.start_date as string | undefined;
  const endDateStr = queryConfig.end_date as string | undefined;

  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    return startDateStr ? parse(startDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    return endDateStr ? parse(endDateStr, 'yyyy-MM-dd', new Date()) : undefined;
  });

  const filters: BookingFilters = {
    tourId: queryConfig.tourId,
    tourAvailableDateIds: queryConfig.tourAvailableDateIds || [],
    status: (queryConfig.status as BookingStatus[]) || [],
    fromDate: queryConfig.start_date,
    toDate: queryConfig.end_date,
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      updateUrlParams({ fromDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      updateUrlParams({ fromDate: undefined });
    }
    setFromDateOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      updateUrlParams({ toDate: format(startOfDay(date), 'yyyy-MM-dd') });
    } else {
      updateUrlParams({ toDate: undefined });
    }
    setToDateOpen(false);
  };

  const updateUrlParams = (newFilters: Partial<BookingFilters>) => {
    const params = new URLSearchParams(window.location.search);

    if (newFilters.tourId) {
      params.set('tourId', newFilters.tourId);
    } else if (newFilters.tourId === undefined) {
      params.delete('tourId');
    }

    if (newFilters.tourAvailableDateIds && newFilters.tourAvailableDateIds.length > 0) {
      params.set('tourAvailableDateIds', newFilters.tourAvailableDateIds.join(','));
    } else if (newFilters.tourAvailableDateIds !== undefined) {
      params.delete('tourAvailableDateIds');
    }

    if (newFilters.status && newFilters.status.length > 0) {
      params.set('status', newFilters.status.join(','));
    } else if (newFilters.status !== undefined) {
      params.delete('status');
    }

    if (newFilters.fromDate) {
      params.set('start_date', newFilters.fromDate);
    } else if (newFilters.fromDate === undefined) {
      params.delete('start_date');
    }

    if (newFilters.toDate) {
      params.set('end_date', newFilters.toDate);
    } else if (newFilters.toDate === undefined) {
      params.delete('end_date');
    }

    params.set('page', '1');

    router.replace(`?${params.toString()}`);
  };

  const handleTourSearch = (searchKey: string) => {
    setIsLoadingTours(true);
    bookingAdminApi
      .searchTours(searchKey)
      .then(result => {
        const tours = result.data || [];
        setTours(tours);
      })
      .catch(error => {
        logger.error('Error searching tours:', error);
        setTours([]);
      })
      .finally(() => {
        setIsLoadingTours(false);
      });
  };

  useEffect(() => {
    if (filters.tourId) {
      setIsLoadingDates(true);
      bookingAdminApi
        .getTourAvailableDates(filters.tourId)
        .then(res => {
          setTourDates(res.data || []);
        })
        .catch(error => {
          logger.error('Error loading tour dates:', error);
          setTourDates([]);
        })
        .finally(() => setIsLoadingDates(false));
    } else {
      setTourDates([]);
    }
  }, [filters.tourId]);

  const updateFilter = (key: keyof BookingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };

    if (key === 'tourId') {
      newFilters.tourAvailableDateIds = [];
    }

    updateUrlParams(newFilters);
  };

  const clearFilter = (key: keyof BookingFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];

    if (key === 'tourId') {
      delete newFilters.tourAvailableDateIds;
    }

    updateUrlParams(newFilters);
  };

  const clearAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    updateUrlParams({
      tourId: undefined,
      tourAvailableDateIds: [],
      status: [],
      fromDate: undefined,
      toDate: undefined,
    });
  };

  const getStatusText = (status: BookingStatus) => {
    const statusKey = status.toLowerCase();
    return tStatus(statusKey as any) || status;
  };

  const statusOptions = Object.values(BookingStatus).map(status => ({
    name: getStatusText(status),
    id: status,
  }));

  const tourOptions = tours.map(tour => ({
    label: tour.title.length > 50 ? `${tour.title.substring(0, 50)}...` : tour.title,
    value: tour.tourId,
  }));

  const tourDateOptions = tourDates.map(date => ({
    name: `${format(new Date(date.startDate), 'dd/MM/yyyy')} - ${format(new Date(date.endDate), 'dd/MM/yyyy')}`,
    id: date.id,
  }));

  const hasFilters = Object.keys(filters).some(key => filters[key as keyof BookingFilters]);

  return (
    <div className="space-y-4">
      
      <div className="flex flex-wrap gap-4">
        
        <div className="w-full md:w-80">
          <SearchableSelect
            placeholder={t('tour')}
            options={tourOptions}
            value={filters.tourId || ''}
            onValueChange={value => updateFilter('tourId', value)}
            onSearch={handleTourSearch}
            loading={isLoadingTours}
            clearable
            loadOnMount={true}
          />
        </div>

        <div className="w-full md:w-96">
          <MultiSelect
            placeholder={t('tour_dates')}
            options={tourDateOptions}
            value={filters.tourAvailableDateIds || []}
            onValueChange={value => updateFilter('tourAvailableDateIds', value)}
            disabled={!filters.tourId || isLoadingDates}
            maxCount={1}
          />
        </div>

        <div className="w-full md:w-auto">
          <MultiSelect
            placeholder={t('status')}
            options={statusOptions}
            value={filters.status || []}
            onValueChange={value => updateFilter('status', value)}
            maxCount={1}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        
        <div className="w-full md:w-48">
          <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy') : 'Từ ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={date => (endDate ? date > endDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-full md:w-48">
          <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy') : 'Đến ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={date => (startDate ? date < startDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {hasFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="h-10">
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {
        <div className="flex flex-wrap gap-2">
          {filters.tourAvailableDateIds?.length || filters.status?.length ? (
            filters.tourAvailableDateIds?.map(dateId => {
              const date = tourDates.find(d => d.id === dateId);
              return date ? (
                <Badge key={dateId} variant="secondary" className="gap-1">
                  {format(new Date(date.startDate), 'dd/MM')} - {format(new Date(date.endDate), 'dd/MM')}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      updateFilter(
                        'tourAvailableDateIds',
                        filters.tourAvailableDateIds?.filter(id => id !== dateId),
                      )
                    }
                  />
                </Badge>
              ) : null;
            })
          ) : (
            <></>
          )}

          {filters.status?.map(status => (
            <Badge key={status} variant="secondary" className="gap-1">
              {getStatusText(status)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  updateFilter(
                    'status',
                    filters.status?.filter(s => s !== status),
                  )
                }
              />
            </Badge>
          ))}
        </div>
      }
    </div>
  );
};
