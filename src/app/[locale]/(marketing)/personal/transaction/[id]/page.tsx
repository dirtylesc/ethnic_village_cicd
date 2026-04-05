'use client';

import { useRouter } from 'next/navigation';
import { bookingApi } from '@/data/apis/booking.api';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Mail,
  MapPin,
  Phone,
  Printer,
  User,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type TransactionDetailPageProps = {
  params: {
    id: string;
  };
}

const LoadingState = () => (
  <div className="mx-auto max-w-[1200px] px-4 py-8">
    <div className="animate-pulse space-y-6">
      <div className="h-56 rounded-lg bg-muted"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-lg bg-muted lg:col-span-2"></div>
        <div className="h-72 rounded-lg bg-muted"></div>
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="mx-auto max-w-[1200px] px-4 py-8">
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        ❌
      </div>
      <h2 className="mb-2 font-roboto text-xl font-bold text-foreground">Không thể tải thông tin giao dịch</h2>
      <p className="mb-6 text-muted-foreground">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
      >
        Thử lại
      </button>
    </div>
  </div>
);

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const router = useRouter();
  const t = useTranslations('personal.detail');

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['booking-detail', params.id],
    queryFn: () => bookingApi.get(params.id),
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING_PAYMENT: {
        color: 'bg-yellow/10 text-yellow-800 border-yellow/30',
        icon: AlertCircle,
        iconColor: 'text-yellow-600',
      },
      PAID: {
        color: 'bg-green/10 text-green-700 border-green/30',
        icon: CheckCircle2,
        iconColor: 'text-green-600',
      },
      CONFIRMED: {
        color: 'bg-primary/10 text-primary border-primary/30',
        icon: CheckCircle2,
        iconColor: 'text-primary',
      },
      CANCELLED: {
        color: 'bg-destructive/10 text-destructive border-destructive/30',
        icon: AlertCircle,
        iconColor: 'text-destructive',
      },
      COMPLETED: {
        color: 'bg-green text-white border-green',
        icon: CheckCircle2,
        iconColor: 'text-white',
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDING_PAYMENT;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPersonCount = (count: any) => {
    if (!count) return 'Chưa xác định';
    const parts = [];
    const adultCount = count.adult || count.adults || 0;
    const childCount = count.child || count.children || 0;
    const infantCount = count.infant || count.infants || 0;

    if (adultCount > 0) parts.push(`${adultCount} người lớn`);
    if (childCount > 0) parts.push(`${childCount} trẻ em`);
    if (infantCount > 0) parts.push(`${infantCount} em bé`);

    return parts.join(', ') || 'Chưa xác định';
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (isLoading) return <LoadingState />;
  if (error || !booking?.data) return <ErrorState />;

  const bookingData = booking.data;
  const statusConfig = getStatusConfig(bookingData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-6">
        
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              In
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Tải xuống
            </Button>
          </div>
        </div>

        <Card
          className="mb-6 overflow-hidden border-l-4"
          style={{ borderLeftColor: statusConfig.iconColor.replace('text-', '') }}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${statusConfig.color}`}>
                  <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor}`} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-roboto text-2xl font-bold text-foreground">
                      Đơn đặt tour #{bookingData.id.slice(-8)}
                    </h1>
                    <Badge className={`${statusConfig.color} border`}>{bookingData.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Đặt ngày {formatDate(bookingData.bookingDate)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tổng thanh toán</p>
                <p className="font-roboto text-3xl font-bold text-primary">{formatCurrency(bookingData.totalPrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          <div className="space-y-6 lg:col-span-2">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Thông tin tour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    {bookingData.tour.imageUrl ? (
                      <img
                        src={bookingData.tour.imageUrl}
                        alt={bookingData.tour.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-roboto text-lg font-bold text-foreground">{bookingData.tour.title}</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {bookingData.tour.pickUpLocation?.city}, {bookingData.tour.pickUpLocation?.province}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{bookingData.tour.duration} ngày</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{formatPersonCount(bookingData.personCount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Lịch trình đặt chỗ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="h-full w-0.5 bg-border"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium text-foreground">Đặt tour</p>
                      <p className="text-sm text-muted-foreground">{formatDate(bookingData.bookingDate)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-green/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="h-full w-0.5 bg-border"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium text-foreground">Ngày khởi hành</p>
                      <p className="text-sm text-muted-foreground">{formatDate(bookingData.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Ngày kết thúc</p>
                      <p className="text-sm text-muted-foreground">{formatDate(bookingData.endDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Chi tiết thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookingData.discountAmountApplied > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Giá gốc</span>
                      <span className="text-muted-foreground line-through">
                        {formatCurrency(bookingData.totalPrice + bookingData.discountAmountApplied)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span className="font-semibold text-green-600">
                        -{formatCurrency(bookingData.discountAmountApplied)}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-roboto text-lg font-bold text-foreground">Tổng cộng</span>
                  <span className="font-roboto text-2xl font-bold text-primary">
                    {formatCurrency(bookingData.totalPrice)}
                  </span>
                </div>

                {bookingData.paymentExpiredDate && bookingData.status === 'PENDING_PAYMENT' && (
                  <div className="border-yellow/30 bg-yellow/10 mt-4 rounded-lg border p-3">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Hạn thanh toán: </span>
                      {formatDate(bookingData.paymentExpiredDate)}
                    </p>
                  </div>
                )}

                {bookingData.additionalInformation && (
                  <div className="mt-4 rounded-lg bg-muted p-3">
                    <p className="mb-1 text-sm font-medium text-foreground">Ghi chú:</p>
                    <p className="text-sm text-muted-foreground">{bookingData.additionalInformation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="border-primary/20 h-16 w-16 border-2">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary font-roboto text-xl font-bold text-white">
                      {getInitials(bookingData.bookerDetail?.fullName || bookingData.bookerDetail?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-roboto font-bold text-foreground">
                      {bookingData.bookerDetail?.fullName || bookingData.bookerDetail?.name || 'Chưa cập nhật'}
                    </h4>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Khách hàng
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="truncate font-medium text-foreground">
                        {bookingData.bookerDetail?.email || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Điện thoại</p>
                      <p className="font-medium text-foreground">
                        {bookingData.bookerDetail?.phoneNumber || bookingData.bookerDetail?.phone || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dịch vụ bao gồm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Hướng dẫn viên chuyên nghiệp', 'Phương tiện di chuyển', 'Bảo hiểm du lịch', 'Hỗ trợ 24/7'].map(
                  (item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
