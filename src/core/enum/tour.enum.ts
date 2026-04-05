export enum TourStatus {
  DRAFT = 'DRAFT',
  REVIEWING = 'REVIEWING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FULLY_BOOKED = 'FULLY_BOOKED',
  ONGOING = 'ONGOING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TourAvailableDateStatus {
  AVAILABLE = 'AVAILABLE',
  FULLY_BOOKED = 'FULLY_BOOKED',
  ONGOING = 'ONGOING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TourFilterTabType {
  POPULAR = 'POPULAR',
  OUTSTANDING = 'OUTSTANDING',
  BEST_PRICE = 'BEST_PRICE',
}

export const TourStatusEnum = {
  DRAFT: {
    value: 'DRAFT',
    variant: 'gray',
  },
  REVIEWING: {
    value: 'REVIEWING',
    variant: 'indigo',
  },
  REJECTED: {
    value: 'REJECTED',
    variant: 'red',
  },
  APPROVED: {
    value: 'APPROVED',
    variant: 'blue',
  },
  SCHEDULED: {
    value: 'SCHEDULED',
    variant: 'purple',
  },
  PUBLISHED: {
    value: 'PUBLISHED',
    variant: 'teal',
  },
  FULLY_BOOKED: {
    value: 'FULLY_BOOKED',
    variant: 'amber',
  },
  ONGOING: {
    value: 'ONGOING',
    variant: 'green',
  },
  PAUSED: {
    value: 'PAUSED',
    variant: 'orange',
  },
  COMPLETED: {
    value: 'COMPLETED',
    variant: 'blue',
  },
  CANCELLED: {
    value: 'CANCELLED',
    variant: 'red',
  },
} as const;

export const TourAvailableDateStatusEnum = {
  AVAILABLE: {
    value: 'AVAILABLE',
    variant: 'teal',
  },
  FULLY_BOOKED: {
    value: 'FULLY_BOOKED',
    variant: 'amber',
  },
  ONGOING: {
    value: 'ONGOING',
    variant: 'green',
  },
  PAUSED: {
    value: 'PAUSED',
    variant: 'orange',
  },
  COMPLETED: {
    value: 'COMPLETED',
    variant: 'blue',
  },
  CANCELLED: {
    value: 'CANCELLED',
    variant: 'red',
  },
} as const;
