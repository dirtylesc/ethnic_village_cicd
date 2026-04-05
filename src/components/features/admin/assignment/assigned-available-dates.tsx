'use client';

import { Suspense, useState } from 'react';
import { Table2, Calendar as CalendarIcon } from 'lucide-react';

import { DataTableSkeleton } from '@/components/shared/data-table/data-table-skeleton';
import { Shell } from '@/components/shared/shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDatesHeader } from './components/assigned-available-dates-header';
import { AssignedAvailableDatesTable } from './components/assigned-available-dates-table';
import { AssignmentCalendarView } from './components/assignment-calendar-view';

export default function AssignedAvailableDatesContent() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState<'table' | 'calendar'>('table');

  return (
    <div className="p-6">
      <AssignedAvailableDatesHeader />
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'table' | 'calendar')}>
        <TabsList className="mb-4">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table2 className="h-4 w-4" />
            {t('tour.assigned_dates.table_view')}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {t('tour.assigned_dates.calendar_view')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <Shell className="gap-2">
            <Suspense
              fallback={
                <DataTableSkeleton
                  columnCount={6}
                  filterCount={3}
                  cellWidths={['12rem', '10rem', '8rem', '8rem', '10rem', '6rem']}
                  shrinkZero
                />
              }
            >
              <AssignedAvailableDatesTable />
            </Suspense>
          </Shell>
        </TabsContent>
        <TabsContent value="calendar">
          <AssignmentCalendarView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
