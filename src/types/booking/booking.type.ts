import { Ethnic } from '../ethnic.type';
import { Location } from '../location.type';
import { Promotion } from '../promotion.type';
import { Review } from '../review.type';

export type TimelineActivity = {
  time: string;
  description: string;
}

export type TimelineDay = {
  day: number;
  activities: TimelineActivity[];
}

export type TourInfo = {
  id: string;
  title: string;
  overview?: string;
  slug?: string;
  imageUrl: string;
  duration: number;
  adultPrice: number;
  childPrice: number;
  pickUpLocation: Location;
  promotions?: Promotion[];
  ethnics?: Ethnic[];
  locations?: Location[];
  reviews?: Review[];
  timeline?: TimelineDay[];
  maxSlots?: number;
  bookedSlots?: number;
  remainingSlots?: number;
}
