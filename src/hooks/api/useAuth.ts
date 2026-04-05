import { authApi } from '@/data/apis/auth.api';
import { useMutation } from '@tanstack/react-query';

import { LoginRequest, SignupRequest } from '@/types/auth.type';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
  });
};
