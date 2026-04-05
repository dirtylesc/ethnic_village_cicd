import instance from '@/core/api/api';
import { API } from '@/core/api/config';

import { ApiResponse } from '@/types/api.type';
import { UserDetailsResponse, UserPersonal } from '@/types/user.type';

export type UpdatePersonalRequest = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  avatar?: string;
}

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const getUserDetails = async (): Promise<ApiResponse<UserDetailsResponse>> => {
  try {
    const response = await instance.get<ApiResponse<UserDetailsResponse>>(API.USER.DETAILS);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};

export const updatePersonalInfo = async (data: UpdatePersonalRequest): Promise<ApiResponse<UserPersonal>> => {
  try {
    const response = await instance.put<ApiResponse<UserPersonal>>(API.USER.UPDATE_PERSONAL, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update personal information');
  }
};

export const updatePassword = async (data: UpdatePasswordRequest): Promise<ApiResponse<void>> => {
  try {
    const response = await instance.put<ApiResponse<void>>(API.USER.UPDATE_PASSWORD, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update password');
  }
};
