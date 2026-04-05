import { API } from '@/core/api';
import api from '@/core/api/api';
import { encodeQueryData } from '@/core/api/utils';

import { ApiResponse } from '@/types/api.type';
import { NotificationListRequest, NotificationListResponse } from '@/types/notification.type';

export const notificationApi = {
  getNotifications: async (params: NotificationListRequest): Promise<ApiResponse<NotificationListResponse>> => {
    try {
      const queryParams = {
        ...params,
        type: params.type,
        isRead: params.isRead,
        notificationId: params.notificationId,
        page: params.page,
        size: params.size,
        sortBy: params.sortBy || 'createdAt',
        order: params.order || 'desc',
      };

      const queryString = encodeQueryData(queryParams);
      const { data } = await api.get<ApiResponse<NotificationListResponse>>(`${API.NOTIFICATION.LIST}?${queryString}`);

      return data;
    } catch {
      throw new Error('Failed to get notifications');
    }
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    try {
      const { data } = await api.get<ApiResponse<number>>(API.NOTIFICATION.UNREAD_COUNT);
      return data;
    } catch {
      throw new Error('Failed to get unread count');
    }
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    try {
      const { data } = await api.put<ApiResponse<void>>(API.NOTIFICATION.MARK_READ.replace('{id}', notificationId));
      return data;
    } catch {
      throw new Error('Failed to mark notification as read');
    }
  },

  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    try {
      const { data } = await api.put<ApiResponse<void>>(API.NOTIFICATION.MARK_ALL_READ);
      return data;
    } catch {
      throw new Error('Failed to mark all notifications as read');
    }
  },

  createSSEConnection: (token?: string): EventSource => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8080';
    let url = `${baseUrl}/api/v1${API.NOTIFICATION.STREAM}`;
    if (token) {
      url += `?token=${token}`;
    }
    return new EventSource(url, { withCredentials: true });
  },
};
