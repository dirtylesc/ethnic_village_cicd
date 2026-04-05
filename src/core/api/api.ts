import { useAuthStore } from '@/stores/useAuthStore';
import { getCookie } from '@/utils/cookie';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { logout } from '@/libs/auth';

import { API_ROOT, TIMEOUT } from './config';

const instance = axios.create({
  baseURL: API_ROOT + '/api/v1',
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function setDefaultHeaders(headers: Record<string, string>): void {
  Object.keys(headers).forEach(key => {
    instance.defaults.headers.common[key] = headers[key];
  });
}

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore.getState();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    config.headers['Accept-Language'] = getCookie('NEXT_LOCALE') || 'vi';

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (!error.response) {

      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        error: 'NETWORK_ERROR',
        statusCode: 0,
      });
    }

    if (error.response.status === 401) {
      logout();
    }

    return Promise.reject(error.response.data);
  },
);

export default instance;
