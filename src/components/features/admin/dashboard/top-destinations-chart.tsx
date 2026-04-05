'use client';

import { useTranslations } from 'next-intl';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useTopDestinations } from '@/hooks/api/useDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: { locationName: string; percentage: number; bookingCount: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <p className="text-sm font-medium">{data.locationName}</p>
        <p className="text-sm text-muted-foreground">
          {data.percentage.toFixed(1)}% ({data.bookingCount} bookings)
        </p>
      </div>
    );
  }
  return null;
}

export function TopDestinationsChart() {
  const t = useTranslations('admin.dashboard');
  const { data: destinations, isLoading, error } = useTopDestinations(5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('top_destinations.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t('error_loading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('top_destinations.title')}</CardTitle>
          <CardDescription>{t('top_destinations.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">{t('top_destinations.empty')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('top_destinations.title')}</CardTitle>
        <CardDescription>{t('top_destinations.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={destinations as any}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="percentage"
              nameKey="locationName"
            >
              {destinations.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, { payload }) => (
                <span className="text-sm">
                  {value} ({(payload as { percentage: number })?.percentage?.toFixed(1)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
