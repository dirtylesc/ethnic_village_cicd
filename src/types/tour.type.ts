import { TourAvailableDateStatus, TourStatus } from '@/core/enum/tour.enum';

import { Ethnic } from './ethnic.type';
import { Location } from './location.type';
import { Promotion } from './promotion.type';
import { Review } from './review.type';
import { TourServiceInfo } from './service-info.type';

export type Tour = {
  id: string;
  tourId?: string;
  imageUrl: string;
  title: string;
  slug?: string;
  overview?: string;
  status?: string;
  duration: number;
  pickUpLocation?: Location;
  adultPrice?: number;
  childPrice?: number;
  contacts?: any;
  timeline?: TourTimeLine[];
  ethnics?: Ethnic[];
  locations?: Location[];
  services?: TourServiceInfo[];
  tourServices?: TourServiceInfo[];
  ratingCount?: number;
  avgRating?: number;
  reviews?: Review[];
  promotions?: Promotion[];
  availableDates?: TourAvailableDate[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TourAvailableDate = {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
  status: TourAvailableDateStatus;
  bookedPersonCounts: {
    adult: number;
    child: number;
  }[];
}

export type TourTimeLine = {
  day: number;
  activities: {
    time: string;
    description: string;
  }[];
}

export type TourListRequest = {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds?: string[];
  locationIds?: string[];
  tagIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  rating?: number;
  minDuration?: number;
  maxDuration?: number;
}

export type TourAdminListRequest = {
  page?: number;
  size?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  ethnicIds?: string[];
  locationIds?: string[];
  onSale?: boolean;
  status?: TourStatus[];
  searchKey?: string;
}

export type TourListResponse = {
  content: Tour[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type TourCreateRequest = {
  title: string;
  imageUrl: string;
  overview?: string;
  status?: string;
  duration: number;
  pickUpLocationId: string;
  adultPrice: number;
  childPrice: number;
  contacts?: any;
  timeline: any;
  availableSlots?: any;
  ethnicIds?: string[];
  locationIds?: string[];
  tagIds?: string[];
  tourIncludedServices?: string[];
  tourExcludedServices?: string[];
  availableDates?: {
    id?: string;
    startDate: Date;
    endDate: Date;
    maxSlots: number;
  }[];
  publishedDate: Date;
};

export type TourResponse = Tour;
