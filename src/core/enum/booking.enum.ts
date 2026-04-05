export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  FAILED_PAYMENT = 'FAILED_PAYMENT',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_ADMIN = 'CANCELLED_BY_ADMIN',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  E_WALLET = 'E_WALLET',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case BookingStatus.PENDING_PAYMENT:
      return 'amber';
    case BookingStatus.PAID:
    case BookingStatus.CONFIRMED:
    case BookingStatus.COMPLETED:
      return 'green';
    case BookingStatus.IN_PROGRESS:
      return 'blue';
    case BookingStatus.CANCELLED_BY_USER:
    case BookingStatus.CANCELLED_BY_ADMIN:
    case BookingStatus.FAILED_PAYMENT:
      return 'destructive';
    case BookingStatus.REFUNDED:
      return 'secondary';
    default:
      return 'default';
  }
};
