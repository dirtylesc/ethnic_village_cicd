'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { getStatusBadgeVariant } from '@/core/enum/booking.enum';
import { formatCurrency } from '@/utils/number';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  CreditCard,
  XCircle,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { BookingListResponse as BookingListItem } from '@/types/booking';
import { useApiBookingCancel } from '@/hooks/api/useBooking';
import { usePayment, usePaymentLink } from '@/hooks/api/usePayment';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/utils/classnames';

type BookingCardProps = {
  booking: BookingListItem;
  index?: number;
}

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  PENDING_PAYMENT: {
    icon: Timer,
    bgColor: 'bg-secondary/10',
    textColor: 'text-secondary',
    borderColor: 'border-secondary/30',
  },
  PAID: {
    icon: CreditCard,
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    borderColor: 'border-primary/30',
  },
  CONFIRMED: {
    icon: CheckCircle2,
    bgColor: 'bg-green/20',
    textColor: 'text-green-700',
    borderColor: 'border-green/30',
  },
  COMPLETED: {
    icon: Sparkles,
    bgColor: 'bg-green/20',
    textColor: 'text-green-700',
    borderColor: 'border-green/30',
  },
  CANCELLED: {
    icon: XCircle,
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border',
  },
};

export default function BookingCard({ booking, index = 0 }: BookingCardProps) {
  const t = useTranslations('personal.transaction');
  const locale = useLocale();
  const router = useRouter();
  const detailUrl = `/${locale}${RouteConstant.personal_transaction_detail.replace(':id', booking.id)}`;

  const { toast } = useToast();
  const { createPayment, isCreatingPayment } = usePayment();
  const { data: existingPaymentLink, isLoading: isLoadingPaymentLink } = usePaymentLink(
    booking.id,
    booking.status === 'PENDING_PAYMENT',
  );
  const { mutateAsync: cancelBooking, isPending: isCancelling } = useApiBookingCancel(booking.id);
  const [isProcessing, setIsProcessing] = useState(false);

  const guestCount = booking.personCount
    ? Object.values(booking.personCount).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0)
    : 1;

  const location =
    booking.tour?.locations && booking.tour.locations.length > 0
      ? booking.tour.locations[0].city || booking.tour.locations[0].province
      : 'Unknown';

  const isPaymentExpired =
    booking.status === 'PENDING_PAYMENT' &&
    booking.paymentExpiredDate &&
    new Date(booking.paymentExpiredDate) <= new Date();

  const getPaymentDeadlineInfo = () => {
    if (!booking.paymentExpiredDate || booking.status !== 'PENDING_PAYMENT') return null;

    const expireDate = new Date(booking.paymentExpiredDate);
    const hoursLeft = differenceInHours(expireDate, new Date());

    if (isPaymentExpired) {
      return { text: t('deadline.expired'), urgent: true, expired: true };
    }

    if (hoursLeft <= 2) {
      return {
        text: formatDistanceToNow(expireDate, { addSuffix: true, locale: vi }),
        urgent: true,
        expired: false,
      };
    }

    if (hoursLeft <= 24) {
      return {
        text: formatDistanceToNow(expireDate, { addSuffix: true, locale: vi }),
        urgent: false,
        expired: false,
      };
    }

    return null;
  };

  const deadlineInfo = getPaymentDeadlineInfo();

  const handlePayNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsProcessing(true);

      if (existingPaymentLink?.checkoutUrl) {
        window.location.href = existingPaymentLink.checkoutUrl;
        return;
      }

      const paymentData = await createPayment(booking.id);

      if (paymentData?.checkoutUrl) {
        window.location.href = paymentData.checkoutUrl;
      } else {
        throw new Error(t('payment_error_description'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('payment_error'),
        description: t('payment_error_description'),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await cancelBooking();
      toast({
        title: t('cancel_success'),
        description: t('cancel_success_description'),
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('cancel_failed'),
        description: t('cancel_failed_description'),
      });
    }
  };

  const getDisplayStatus = () => {
    if (isPaymentExpired) {
      return 'expired_payment';
    }
    return booking.status.toLowerCase();
  };

  const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CANCELLED;
  const StatusIcon = statusConfig.icon;

  return (
    <Link
      href={detailUrl}
      className="group block"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <article
        className={cn(
          'relative overflow-hidden rounded-lg border bg-card transition-all duration-200',
          'shadow-sm hover:shadow-md',
          'hover:-translate-y-0.5',
          statusConfig.borderColor,
        )}
      >
        
        {deadlineInfo?.urgent && !deadlineInfo.expired && (
          <div className="flex items-center justify-between bg-destructive px-4 py-2 text-sm font-medium text-white">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{t('deadline.urgent')}</span>
            </div>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
              {deadlineInfo.text}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row">
          
          <div className="relative h-40 w-full flex-shrink-0 overflow-hidden lg:h-auto lg:w-48">
            <img
              src={booking.tour?.imageUrl || '/images/placeholder.jpg'}
              alt={booking.tour?.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="flex flex-1 flex-col p-4">
            
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="mb-1 text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {booking.tour?.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('booking_code')}: <span className="font-mono font-medium text-foreground">#{booking.id.slice(-8)}</span>
                </p>
              </div>

              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold',
                  statusConfig.bgColor,
                  statusConfig.textColor,
                  isPaymentExpired && 'bg-destructive/10 text-destructive',
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                <span>{t(`status.${getDisplayStatus()}` as any)}</span>
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {format(new Date(booking.startDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {booking.tour?.duration} {t('days')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">
                    {guestCount} {t('people') || 'people'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(booking.totalPrice, { locale: locale as 'vi' | 'en' | 'ko' })}
                </span>
                {(booking.discountAmountApplied ?? 0) > 0 && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(booking.totalPrice + (booking.discountAmountApplied ?? 0), {
                      locale: locale as 'vi' | 'en' | 'ko',
                    })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {booking.status === 'PENDING_PAYMENT' && !isPaymentExpired && (
                  <button
                    onClick={handlePayNow}
                    disabled={isCreatingPayment || isProcessing || isLoadingPaymentLink}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md bg-secondary-500 px-3 py-1.5 text-xs font-semibold shadow-sm transition-all',
                      'hover:bg-secondary-600 hover:shadow-md',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    {isCreatingPayment || isProcessing || isLoadingPaymentLink ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>{t('processing')}</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{t('actions.pay_now' as any)}</span>
                      </>
                    )}
                  </button>
                )}

                {['PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(booking.status) && !isPaymentExpired && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all',
                      'hover:border-destructive/50 hover:text-destructive',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    {isCancelling ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                        <span>{t('cancelling')}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        <span>{t('actions.cancel' as any)}</span>
                      </>
                    )}
                  </button>
                )}

                {booking.status === 'COMPLETED' && (
                  <button
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-1.5 rounded-md bg-star/20 px-3 py-1.5 text-xs font-medium text-yellow-700 transition-all hover:bg-star/30"
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span>{t('actions.review' as any)}</span>
                  </button>
                )}

                <button
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(detailUrl);
                  }}
                  className="group/view flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t('actions.view_details' as any)}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/view:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
