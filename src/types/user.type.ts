import { ApiResponse } from './api.type';
import { Personal } from './auth.type';
import { Bookmark } from './bookmark.type';

export type User = {
  id: number;
  email: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  avatar?: string;
  personal?: UserPersonal;
}

export type UserDetailsResponse = {
  bookmarks: Bookmark[];
  pendingPaymentBookingsCount: number;
  lastUpdated: string;
} & ApiResponse

export type UserPersonal = {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
}

export type UserRole = {
  id: string;
  name: string;
  description?: string;
}

export type UserAdmin = {
  id: string;
  email: string;
  active: boolean;
  personal?: UserPersonal;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export type CreateUserRequest = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  roleIds?: string[];
}

export type UpdateUserRequest = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  active?: boolean;
  roleIds?: string[];
}

export type UserFilters = {
  search?: string;
  roleId?: string;
  active?: boolean;
}
