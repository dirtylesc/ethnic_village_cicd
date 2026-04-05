import type { PersonalBasicInfo } from './personal.type';

export type EmployeeBasicResponse = {
  id: string;
  email: string;
  description: string;
  isActive: boolean;
  personal?: PersonalBasicInfo;
}

export type EmployeeAdmin = {
  id: string;
  email: string;
  personal?: {
    id: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phoneNumber?: string;
    avatar?: string;
    address?: string;
    dateOfBirth?: string;
  };
  description?: string;
  hiredDate?: string;
  isActive: boolean;
  roles: { id: string; name: string; description?: string }[];
  createdAt: string;
  updatedAt: string;
}

export type UpdateEmployeeRequest = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  hiredDate?: string;
  isActive?: boolean;
  password?: string;
}

export type CreateEmployeeRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  description?: string;
  hiredDate?: string;
  roleId?: string;
}

export type EmployeeFilters = {
  search?: string;
  isActive?: boolean;
}

export type EmployeeSelectedResponse = {
  id: string;
  email: string;
  personal?: {
    firstName: string;
    lastName: string;
  } | null;
}

export type EmployeeDateRangeRequest = {
  startDate: string;
  endDate: string;
}

export type AssignedEmployeesByDatesRequest = {
  availableDateIds: string[];
}

export type AssignedEmployeesByDatesResponse = {
  assignedEmployeesByDate: { [dateId: string]: EmployeeBasicResponse[] };
}
