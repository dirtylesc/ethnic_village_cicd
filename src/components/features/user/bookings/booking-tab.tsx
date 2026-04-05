'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSearchParams } from '@/utils';
import { Receipt, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookingListRequest } from '@/types/booking';
import { useQueryConfig } from '@/hooks/use-query-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix/tabs';

import BookingFilters from './booking-filters';
import BookingOtherList from './booking-other-list';
import BookingPendingList from './booking-pending-list';

export const TABS = {
  PENDING: 'PENDING',
  OTHERS: 'OTHERS',
} as const;

export default function BookingTabContent() {
  const t = useTranslations('personal.transaction');
  const router = useRouter();
  const queryConfig = useQueryConfig();
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>(TABS.PENDING);

  useEffect(() => {
    if (queryConfig.page === 0) return;

    const query = createSearchParams({
      ...queryConfig,
      page: 1,
    });

    router.replace(`?${query.toString()}`);
  }, [activeTab]);

  const handleFilterChange = (filters: Partial<BookingListRequest>) => {
    const newParams: Record<string, string> = {};

    if (filters.startDate) {
      newParams['start_date'] = filters.startDate.toString();
    }
    if (filters.endDate) {
      newParams['end_date'] = filters.endDate.toString();
    }
    if (!filters.startDate && !filters.endDate) {
      newParams['status'] = filters.status && filters.status.length > 0 ? filters.status.join(',') : '';
    }

    const query = createSearchParams({
      ...queryConfig,
      ...newParams,
      page: 1,
    });

    router.push(`?${query.toString()}`);
  };

  return (
    <div className="w-full">
      
      <div className="relative mx-auto max-w-5xl space-y-5">
        
        <header className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Receipt className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-roboto text-xl font-bold text-foreground sm:text-2xl">
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('description') || 'Manage your tour bookings'}
            </p>
          </div>
        </header>

        <BookingFilters onFilterChange={handleFilterChange} showStatusFilter={activeTab === TABS.OTHERS} />

        <Tabs
          defaultValue={TABS.PENDING}
          className="w-full"
          onValueChange={value => setActiveTab(value as keyof typeof TABS)}
          value={activeTab}
        >
          <TabsList className="mb-5 inline-flex h-auto rounded-lg border border-border bg-card p-1.5 shadow-sm">
            
            <TabsTrigger
              value={TABS.PENDING}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-roboto text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground"
            >
              <Clock className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('tabs.pending')}</span>
            </TabsTrigger>

            <TabsTrigger
              value={TABS.OTHERS}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-roboto text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground"
            >
              <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
              <span>{t('tabs.other')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={TABS.PENDING} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <BookingPendingList />
          </TabsContent>

          <TabsContent value={TABS.OTHERS} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <BookingOtherList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
