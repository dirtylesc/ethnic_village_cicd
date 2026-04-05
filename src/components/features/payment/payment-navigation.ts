export function getOrderDetailsUrl(orderCode: string): string {
  return `/order/view/${orderCode}`;
}

export function getRetryPaymentUrl(orderCode: string): string {
  return `/order/${orderCode}`;
}

export function getTourListingUrl(): string {
  return '/tour';
}
