'use client';

import { Calendar, Clock, DollarSign, Plane } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useDashboardStats } from '@/hooks/api/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardStatsCards() {
  const t = useTranslations('admin.dashboard');
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">{t('error_loading')}</p>
      </div>
    );
  }

  const cards = [
    {
      title: t('metrics.total_revenue'),
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      trend: stats.revenueGrowthPercent,
      description: t('metrics.total_revenue_desc'),
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: t('metrics.new_bookings'),
      value: stats.newBookingsCount.toString(),
      icon: Calendar,
      description: t('metrics.new_bookings_desc'),
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t('metrics.upcoming_departures'),
      value: stats.upcomingDeparturesCount.toString(),
      icon: Plane,
      trend: null,
      description: t('metrics.upcoming_departures_desc'),
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: t('metrics.pending_bookings'),
      value: stats.pendingBookingsCount.toString(),
      icon: Clock,
      trend: null,
      description: t('metrics.pending_bookings_desc'),
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
