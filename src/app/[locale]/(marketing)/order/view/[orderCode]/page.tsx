'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/number';
import { canRetryPayment, getTimeRemaining } from '@/utils/payment';
import { paymentApi } from '@/data/apis/payment.api';
import { Clock, CreditCard, Mail, MapPin, Phone, User, XCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import logger from '@/libs/logger';

import type { TimelineDay } from '@/types/booking/booking.type';
import { Link } from '@/libs/i18n-navigation';
import { useApiBookingGetByOrderCode } from '@/hooks/api/useBooking';
import { Button } from '@/components/ui/button';
import { bookingApi } from '@/data/apis/booking.api';

const statusConfig: Record<string, { style: string; label: string }> = {
  PAID: { style: 'bg-green-100 text-green-700', label: 'Đã thanh toán' },
  PENDING_PAYMENT: { style: 'bg-yellow-100 text-yellow-800', label: 'Chờ thanh toán' },
  CONFIRMED: { style: 'bg-primary-primary-100 text-primary-600', label: 'Đã xác nhận' },
  CANCELLED: { style: 'bg-red-100 text-red-700', label: 'Đã hủy' },
  COMPLETED: { style: 'bg-green-100 text-green-700', label: 'Hoàn thành' },
};

function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1172px] px-4 py-8">
      <div className="animate-pulse">
        <div className="mb-6 h-48 rounded-lg bg-gray-200" />
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="h-64 rounded-lg bg-gray-200" />
        </div>
        <div className="h-96 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function TourTimeline({ timeline }: { timeline: TimelineDay[] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm">
      <h3 className="text-dark-500 mb-4 flex items-center text-lg font-bold">
        <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-sm">📅</span>
        Lịch trình tour
      </h3>
      <div className="space-y-4">
        {timeline.map(dayItem => (
          <div key={dayItem.day} className="border-light-light-10 border-b pb-4 last:border-0 last:pb-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                {dayItem.day}
              </span>
              <span className="text-dark-500 font-semibold">Ngày {dayItem.day}</span>
            </div>
            <div className="ml-3 space-y-2 border-l-2 border-gray-200 pl-4">
              {dayItem.activities.map((activity, actIdx) => (
                <div key={actIdx} className="relative flex items-start gap-3">
                  <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary-400 bg-white" />
                  <span className="min-w-[50px] text-sm font-medium text-primary-600">{activity.time}</span>
                  <span className="text-sm text-gray-600">{activity.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;
  const t = useTranslations('order');
  const locale = useLocale() as 'vi' | 'en';

  const { data: booking, isLoading, isError } = useApiBookingGetByOrderCode(orderCode);

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!booking?.paymentExpiredDate) return;

    const updateTimer = () => {
      setTimeRemaining(getTimeRemaining(booking.paymentExpiredDate));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [booking?.paymentExpiredDate]);

  const handleContinuePayment = async () => {
    if (!booking?.id) return;

    try {
      setIsProcessingPayment(true);

      const paymentData = await paymentApi.createPayment(booking.id);

      window.location.href = paymentData.checkoutUrl;
    } catch (error) {
      logger.error('Failed to create payment link:', error);
      alert('Không thể tạo link thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!orderCode || !confirm('Bạn có chắc muốn hủy booking này?')) return;

    try {
      setIsCancelling(true);
      await bookingApi.cancelByOrderCode(orderCode);

      router.refresh();
    } catch (error) {
      logger.error('Failed to cancel booking:', error);
      alert('Không thể hủy booking. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <OrderDetailSkeleton />;

  if (isError || !booking) {
    return (
      <div className="mx-auto max-w-[1172px] px-4 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            ❌
          </div>
          <h2 className="text-dark-500 mb-2 text-xl font-bold">{t('not_found_title')}</h2>
          <p className="mb-4 text-gray-500">{t('not_found_message')}</p>
          <Link href="/tour">
            <Button>{t('browse_tours')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status] || { style: 'bg-gray-100 text-gray-800', label: booking.status };
  const duration = booking.tour?.duration || 1;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1172px] px-4 py-8">
        <div className="bg-white-500 mb-6 rounded-lg border border-light-500 p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-1/3">
              {booking.tour?.imageUrl ? (
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <Image src={booking.tour.imageUrl} alt={booking.tour.title || 'Tour'} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-4xl">🏞️</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between lg:w-2/3">
              <div>
                <h1 className="text-dark-500 mb-2 text-2xl font-bold">{booking.tour?.title}</h1>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {duration} ngày {duration > 1 ? `${duration - 1} đêm` : ''}
                  </span>
                  {booking.tour?.pickUpLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.tour.pickUpLocation.city}, {booking.tour.pickUpLocation.province}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${status.style}`}>{status.label}</span>
                    <span className="font-mono text-sm text-gray-500">#{orderCode}</span>
                  </div>

                  {canRetryPayment(booking.status, booking.paymentExpiredDate) && (
                    <div className="flex flex-col gap-2">
                      {timeRemaining && (
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span>Còn {timeRemaining} để thanh toán</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={handleContinuePayment}
                          disabled={isProcessingPayment}
                          size="sm"
                          className="gap-1"
                        >
                          <CreditCard className="h-4 w-4" />
                          {isProcessingPayment ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                        </Button>
                        <Button
                          onClick={handleCancelBooking}
                          disabled={isCancelling}
                          variant="outline"
                          size="sm"
                          className="gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          {isCancelling ? 'Đang hủy...' : 'Hủy booking'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm">
              <h3 className="text-dark-500 mb-4 flex items-center text-lg font-bold">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-sm">
                  📋
                </span>
                Thông tin đặt tour
              </h3>
              <div className="space-y-3">
                <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                  <span className="font-medium text-gray-500">Ngày khởi hành:</span>
                  <span className="text-dark-500 font-semibold">
                    {booking.startDate ? formatDate(booking.startDate) : '-'}
                  </span>
                </div>
                <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                  <span className="font-medium text-gray-500">Ngày kết thúc:</span>
                  <span className="text-dark-500 font-semibold">
                    {booking.endDate ? formatDate(booking.endDate) : '-'}
                  </span>
                </div>
                <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                  <span className="font-medium text-gray-500">Số khách:</span>
                  <span className="text-dark-500 font-semibold">
                    {booking.personCount?.adult || 0} {t('adults')}
                    {booking.personCount?.child ? `, ${booking.personCount.child} ${t('children')}` : ''}
                  </span>
                </div>
                {booking.discountAmountApplied > 0 && (
                  <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                    <span className="font-medium text-gray-500">Giảm giá:</span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(booking.discountAmountApplied)}
                    </span>
                  </div>
                )}
                <div className="bg-primary-primary-5 flex items-center justify-between rounded-lg px-3 py-3">
                  <span className="font-medium text-gray-700">{t('total_paid')}:</span>
                  <span className="text-xl font-bold text-primary-600">{formatCurrency(booking.totalPrice || 0)}</span>
                </div>
              </div>
            </div>

            {booking.tour?.timeline && <TourTimeline timeline={booking.tour.timeline} />}
          </div>

          <div className="lg:col-span-1">
            {booking.bookerDetail && (
              <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm">
                <h3 className="text-dark-500 mb-4 flex items-center text-lg font-bold">
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm">
                    👤
                  </span>
                  {t('contact_info_title')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Họ tên</p>
                      <p className="text-dark-500 font-medium">{booking.bookerDetail.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-dark-500 font-medium">{booking.bookerDetail.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Số điện thoại</p>
                      <p className="text-dark-500 font-medium">{booking.bookerDetail.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
