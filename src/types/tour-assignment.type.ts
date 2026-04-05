import { TourAvailableDateStatus, TourStatus } from '@/core/enum/tour.enum';

import type { EmployeeBasicResponse } from './employee.type';
import { Location } from './location.type';
import { TourAvailableDate } from './tour.type';

export type TourAssignmentRequest = {
  assignments: {
    [availableDateId: string]: string;
  };
};

export type TourAssignmentResponse = {
  id: string;
  guide: EmployeeBasicResponse;
  tourAvailableDateId: string;
  assignedBy: string;
};

export type SingleAssignmentRequest = {
  tourAvailableDateId: string;
  guideId: string;
};

export type AssignedAvailableDatesRequest = {
  page: number;
  size: number;
  sortBy: string;
  order: 'asc' | 'desc';

  tourStatus?: TourStatus[];
  fromDate?: string;
  toDate?: string;
  tourId?: string;
  searchKey?: string;

  employeeIds?: string[];
};

export type TourBasicInfo = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  status: TourStatus;
  duration: number;
  pickUpLocation?: Location;
};

export type AssignedAvailableDateResponse = {
  assignmentId: string;
  assignedBy: string;
  assignedDate?: string;

  tourAvailableDate: TourAvailableDate;

  tour: TourBasicInfo;

  guide?: EmployeeBasicResponse;
};

export type AssignedAvailableDateListResponse = {
  content: AssignedAvailableDateResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

export type CalendarAssignmentsRequest = {
  startDate: string;
  endDate: string;
  tourId?: string;
};

export type CalendarAssignmentResponse = {
  assignmentId: string;
  startDate: string;
  endDate: string;
  assignedDate?: string;
  assignedBy?: string;

  tourId: string;
  tourTitle: string;
  tourSlug: string;
  tourImageUrl?: string;
  tourStatus: string;
  tourDuration: number;

  status: string;
  maxSlots: number;
  bookedSlots: number;

  guideId: string;
  guideName: string;
  guideEmail: string;
};

export type AssignmentHistoryRequest = {
  assignmentId?: string;
  tourAvailableDateId?: string;
  guideId?: string;
};

export type AssignmentHistoryResponse = {
  id: string;
  assignmentId: string;
  tourAvailableDateId: string;

  previousGuide?: EmployeeBasicResponse;
  newGuide?: EmployeeBasicResponse;

  changedByEmail?: string;
  changedByName?: string;

  changeReason?: string;
  previousStatus?: string;
  newStatus?: string;

  createdAt: string;
};

export type UpdateTourAvailableDateStatusRequest = {
  tourAvailableDateId: string;
  status: TourAvailableDateStatus;
};

export type TourAvailableDateStatusUpdateResponse = {
  tourAvailableDateId: string;
  previousStatus: TourAvailableDateStatus;
  newStatus: TourAvailableDateStatus;
  updatedAt: string;
};
