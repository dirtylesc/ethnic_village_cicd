'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useRevenueChart } from '@/hooks/api/useDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(value: number) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

function formatFullCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === 'currentRevenue' ? 'Doanh thu thực tế' : 'Cùng kỳ tháng trước'}:{' '}
            {formatFullCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  const t = useTranslations('admin.dashboard');
  const { data: chartData, isLoading, error } = useRevenueChart(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue_chart.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t('error_loading')}</p>
        </CardContent>
      </Card>
    );
  }

  const formattedData = chartData?.map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'dd/MM', { locale: vi }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('revenue_chart.title')}</CardTitle>
        <CardDescription>{t('revenue_chart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="currentRevenue"
              name={t('revenue_chart.current')}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="previousRevenue"
              name={t('revenue_chart.previous')}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
