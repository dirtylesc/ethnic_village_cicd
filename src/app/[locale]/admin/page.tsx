'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslations } from 'next-intl';

import {
  DashboardStatsCards,
  RecentBookings,
  RevenueChart,
  TopDestinationsChart,
  UpcomingDepartures,
} from '@/components/features/admin/dashboard';
import { Shell } from '@/components/shared/shell';

export default function Dashboard() {
  const t = useTranslations('admin.dashboard');
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.roles?.includes('ROLE_TOUR_AGENCY')) {
      router.replace(RouteConstant.admin_assigned_available_dates);
    }
  }, [user, router]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-base text-muted-foreground">{t('welcome')}</p>
      </div>

      <Shell className="gap-6">
        <section>
          <DashboardStatsCards />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.operations')}</h2>
          <UpcomingDepartures />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.analytics')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart />
            <TopDestinationsChart />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('sections.recent_activity')}</h2>
          <RecentBookings />
        </section>
      </Shell>
    </div>
  );
}
