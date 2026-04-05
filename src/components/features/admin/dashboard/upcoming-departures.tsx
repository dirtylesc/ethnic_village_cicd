'use client';

import Link from 'next/link';
import { format, isToday, isTomorrow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

import { useUpcomingDepartures } from '@/hooks/api/useDashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  FULL: { label: 'Hết chỗ', variant: 'destructive' },
  SUFFICIENT: { label: 'Đủ đoàn', variant: 'default' },
  NEED_MORE: { label: 'Thiếu khách', variant: 'secondary' },
  AVAILABLE: { label: 'Còn chỗ', variant: 'outline' },
};

export function UpcomingDepartures() {
  const t = useTranslations('admin.dashboard');
  const { data: departures, isLoading, error } = useUpcomingDepartures(7, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('upcoming_departures.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t('error_loading')}</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hôm nay';
    if (isTomorrow(date)) return 'Ngày mai';
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  const isHighlighted = (dateStr: string) => {
    const date = new Date(dateStr);
    return isToday(date) || isTomorrow(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('upcoming_departures.title')}</CardTitle>
        <CardDescription>{t('upcoming_departures.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!departures || departures.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('upcoming_departures.empty')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('upcoming_departures.tour_name')}</TableHead>
                <TableHead>{t('upcoming_departures.departure_date')}</TableHead>
                <TableHead className="text-center">{t('upcoming_departures.slots')}</TableHead>
                <TableHead className="text-center">{t('upcoming_departures.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departures.slice(0, 10).map(departure => {
                const status = statusConfig[departure.status] || statusConfig.AVAILABLE;
                const highlighted = isHighlighted(departure.startDate);

                return (
                  <TableRow key={departure.availableDateId}>
                    <TableCell>
                      <Link
                        href={`/vi/admin/tour/${departure.tourId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {departure.tourTitle}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className={highlighted ? 'font-semibold text-red-500' : ''}>
                        {formatDate(departure.startDate)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono">
                        {departure.bookedSlots}/{departure.maxSlots}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
