'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/utils/classnames';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DateFilterCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
  );

  const updateURL = (newStartDate?: Date, newEndDate?: Date) => {
    const params = new URLSearchParams(searchParams);

    if (newStartDate) {
      params.set('startDate', format(newStartDate, 'yyyy-MM-dd'));
    } else {
      params.delete('startDate');
    }

    if (newEndDate) {
      params.set('endDate', format(newEndDate, 'yyyy-MM-dd'));
    } else {
      params.delete('endDate');
    }

    params.set('page', '0');

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    updateURL(date, endDate);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    updateURL(startDate, date);
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    updateURL(undefined, undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thời gian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Ngày bắt đầu</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Ngày kết thúc</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={date => {
                  const today = new Date(new Date().setHours(0, 0, 0, 0));
                  return date < today || (startDate ? date < startDate : false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {(startDate || endDate) && (
          <Button variant="outline" size="sm" onClick={clearDates} className="w-full">
            Xóa lọc thời gian
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
