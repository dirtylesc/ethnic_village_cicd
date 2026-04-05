'use client';

import { useCallback } from 'react';

import { toast } from '@/hooks/use-toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastOptions = {
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
}

const TOAST_MESSAGES = {
  vi: {
    promotionApplied: 'Mã khuyến mãi đã được áp dụng',
    promotionInvalid: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn',
    promotionError: 'Không thể kiểm tra mã khuyến mãi. Vui lòng thử lại.',
    bookingSaved: 'Thông tin đặt tour đã được lưu',
    bookingRestored: 'Đã khôi phục thông tin đặt tour trước đó',
    bookingExpired: 'Phiên đặt tour đã hết hạn. Vui lòng bắt đầu lại.',
    networkError: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
    validationError: 'Vui lòng kiểm tra lại thông tin đã nhập',
    paymentInitiated: 'Đang chuyển đến trang thanh toán...',
    paymentFailed: 'Thanh toán thất bại. Vui lòng thử lại.',
    genericError: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  },
  en: {
    promotionApplied: 'Promotion code applied successfully',
    promotionInvalid: 'Promotion code is invalid or expired',
    promotionError: 'Unable to verify promotion code. Please try again.',
    bookingSaved: 'Booking information saved',
    bookingRestored: 'Previous booking information restored',
    bookingExpired: 'Booking session expired. Please start again.',
    networkError: 'Network error. Please check your internet connection.',
    validationError: 'Please check the information you entered',
    paymentInitiated: 'Redirecting to payment page...',
    paymentFailed: 'Payment failed. Please try again.',
    genericError: 'An error occurred. Please try again later.',
  },
};

export type ToastMessageKey = keyof typeof TOAST_MESSAGES.vi;

export function useBookingToast(locale: 'vi' | 'en' = 'vi') {
  const messages = TOAST_MESSAGES[locale];

  const showToast = useCallback(({ title, description, type = 'info' }: ToastOptions) => {
    toast({
      title,
      description,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  }, []);

  const showSuccess = useCallback(
    (messageKey: ToastMessageKey | string, customTitle?: string) => {
      const description = messages[messageKey as ToastMessageKey] || messageKey;
      showToast({
        title: customTitle,
        description,
        type: 'success',
      });
    },
    [messages, showToast],
  );

  const showError = useCallback(
    (messageKey: ToastMessageKey | string, customTitle?: string) => {
      const description = messages[messageKey as ToastMessageKey] || messageKey;
      showToast({
        title: customTitle,
        description,
        type: 'error',
      });
    },
    [messages, showToast],
  );

  const showWarning = useCallback(
    (messageKey: ToastMessageKey | string, customTitle?: string) => {
      const description = messages[messageKey as ToastMessageKey] || messageKey;
      showToast({
        title: customTitle,
        description,
        type: 'warning',
      });
    },
    [messages, showToast],
  );

  const showInfo = useCallback(
    (messageKey: ToastMessageKey | string, customTitle?: string) => {
      const description = messages[messageKey as ToastMessageKey] || messageKey;
      showToast({
        title: customTitle,
        description,
        type: 'info',
      });
    },
    [messages, showToast],
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    messages,
  };
}
