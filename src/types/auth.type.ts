import { User } from './user.type';

export type LoginRequest = {
  email: string;
  password: string;
}

export type SignupRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type Personal = {
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: User;
}
