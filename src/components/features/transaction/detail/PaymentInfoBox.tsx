import React from 'react';
import { useTranslations } from 'next-intl';

type PaymentInfo = {
  id: string;
  amount: number;
  status: string;
  method: string;
  transactionId?: string;
  paymentDate?: string;
  orderCode?: string;
  bankName?: string;
  accountNumber?: string;
}

type PaymentInfoBoxProps = {
  payment?: PaymentInfo;
  paymentExpiredDate?: string;
}

export const PaymentInfoBox: React.FC<PaymentInfoBoxProps> = ({ payment, paymentExpiredDate }) => {
  const t = useTranslations('personal.detail');
  const tPayment = useTranslations('personal.transaction.payment_method');
  const tAdmin = useTranslations();

  const getPaymentStatusStyle = (status: string) => {
    const statusMap: Record<string, string> = {
      SUCCESS: 'text-green-600',
      PENDING: 'text-yellow-600',
      FAILED: 'text-red-600',
      CANCELLED: 'text-gray-600',
    };
    return statusMap[status] || 'text-gray-600';
  };

  const getPaymentStatusText = (status: string, tAdmin: any) => {

    if (status === 'CANCELLED') {
      return tAdmin('admin.status.CANCELLED');
    }

    const statusTextMap: Record<string, string> = {
      SUCCESS: 'Thành công',
      PENDING: 'Đang xử lý',
      FAILED: 'Thất bại',
    };
    return statusTextMap[status] || status;
  };

  const getPaymentMethodText = (method: string) => {
    const methodKey = method.toLowerCase();
    return (tPayment as any)(methodKey) || method;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white-500 rounded-lg border border-light-500 p-6 shadow-sm transition-shadow hover:shadow-md">
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-dark-500 flex items-center text-lg font-bold">
          <span className="bg-secondary-secondary-100 mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-secondary-600">
            💳
          </span>
          {t('booking_info.payment_info')}
        </h3>
      </div>

      <div className="space-y-3">
        {payment ? (
          <>
            
            <div className="border-light-light-10 flex items-center justify-between border-b py-2">
              <span className="font-medium text-gray-500">{t('booking_info.total_amount')}:</span>
              <span className="text-dark-500 text-lg font-bold">{formatCurrency(payment.amount)}</span>
            </div>

            <div className="border-light-light-10 flex items-center justify-between border-b py-2">
              <span className="font-medium text-gray-500">{t('booking_info.payment_method')}:</span>
              <span className="text-dark-500 font-semibold">{getPaymentMethodText(payment.method)}</span>
            </div>

            <div className="border-light-light-10 flex items-center justify-between border-b py-2">
              <span className="font-medium text-gray-500">{t('customer_info.status')}:</span>
              <span className={`font-semibold ${getPaymentStatusStyle(payment.status)}`}>
                {getPaymentStatusText(payment.status, tAdmin)}
              </span>
            </div>

            {payment.transactionId && (
              <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                <span className="font-medium text-gray-500">{t('booking_info.booking_id')}:</span>
                <span className="text-dark-500 font-mono text-sm font-semibold">{payment.transactionId}</span>
              </div>
            )}

            {payment.orderCode && (
              <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                <span className="font-medium text-gray-500">{t('booking_info.booking_id')}:</span>
                <span className="text-dark-500 font-mono text-sm font-semibold">{payment.orderCode}</span>
              </div>
            )}

            {payment.paymentDate && (
              <div className="border-light-light-10 flex items-center justify-between border-b py-2">
                <span className="font-medium text-gray-500">{t('booking_info.payment_date')}:</span>
                <span className="text-dark-500 text-sm font-semibold">{formatDateTime(payment.paymentDate)}</span>
              </div>
            )}

            {payment.bankName && (
              <div className="bg-light-light-5 mt-4 rounded-lg p-3">
                <p className="mb-1 text-sm text-gray-500">{t('booking_info.payment_info')}:</p>
                <p className="text-dark-500 text-sm font-semibold">{payment.bankName}</p>
                {payment.accountNumber && (
                  <p className="font-mono text-sm text-gray-500">STK: {payment.accountNumber}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              ⏱️
            </div>
            <p className="mb-2 text-gray-500">{t('customer_info.not_updated')}</p>

            {paymentExpiredDate && (
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">{t('booking_info.payment_deadline')}: </span>
                  {formatDateTime(paymentExpiredDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {payment?.status === 'SUCCESS' && (
          <div className="mt-4 flex space-x-2">
            <button className="bg-primary-primary-100 hover:bg-primary-primary-200 flex-1 rounded-lg px-3 py-2 text-sm font-medium text-primary-600 transition-colors">
              {t('actions.print_invoice')}
            </button>
            <button className="hover:bg-primary-primary-10 flex-1 rounded-lg border border-primary-500 px-3 py-2 text-sm font-medium text-primary-500 transition-colors">
              {t('actions.download_pdf')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
