'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslations } from 'next-intl';

import { useRecentBookings } from '@/hooks/api/useDashboard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', variant: 'secondary' },
  PAID: { label: 'Đã thanh toán', variant: 'default' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
  IN_PROGRESS: { label: 'Đang thực hiện', variant: 'outline' },
  COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
  CANCELLED_BY_USER: { label: 'Khách hủy', variant: 'destructive' },
  CANCELLED_BY_ADMIN: { label: 'Admin hủy', variant: 'destructive' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentBookings() {
  const t = useTranslations('admin.dashboard');
  const { data: bookings, isLoading, error } = useRecentBookings(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
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
          <CardTitle>{t('recent_bookings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{t('error_loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recent_bookings.title')}</CardTitle>
        <CardDescription>{t('recent_bookings.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!bookings || bookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('recent_bookings.empty')}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('recent_bookings.id')}</TableHead>
                <TableHead>{t('recent_bookings.customer')}</TableHead>
                <TableHead>{t('recent_bookings.tour')}</TableHead>
                <TableHead>{t('recent_bookings.departure_date')}</TableHead>
                <TableHead className="text-right">{t('recent_bookings.total')}</TableHead>
                <TableHead className="text-center">{t('recent_bookings.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(booking => {
                const status = statusConfig[booking.status] || { label: booking.status, variant: 'outline' as const };

                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      <Link href={`/vi/admin/booking/${booking.id}`} className="text-primary hover:underline">
                        {booking.id.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{booking.customerName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{booking.customerPhone || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{booking.tourTitle || 'N/A'}</TableCell>
                    <TableCell>
                      {booking.departureDate
                        ? format(new Date(booking.departureDate), 'dd/MM/yyyy', { locale: vi })
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(booking.totalPrice || 0)}</TableCell>
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
