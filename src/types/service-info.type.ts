import { TourServiceInfoType } from '@/core/enum/tour-service-info.enum';

export type Service = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export type TourServiceInfo = {
  id: string;
  name: string;
  description: string;
  included?: boolean;
  type?: TourServiceInfoType;
}

export type ServiceInfoBasic = {
  id: string;
  name: string;
  description?: string;
}
