import { useEffect, useRef, useState } from 'react';
import { notificationApi } from '@/data/apis/notification.api';
import { useAuthStore } from '@/stores/useAuthStore';
import { getCookie } from '@/utils/cookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import logger from '@/libs/logger';

import { Notification, NotificationListRequest, NotificationListResponse } from '@/types/notification.type';
import { ApiResponse } from '@/types/api.type';

export const NOTIFICATION_QUERY_KEY = {
  LIST: 'notification-list',
  UNREAD_COUNT: 'notification-unread-count',
};

export const useNotifications = (params: NotificationListRequest) => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY.LIST, params],
    queryFn: () => notificationApi.getNotifications(params),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY.UNREAD_COUNT],
    queryFn: () => notificationApi.getUnreadCount(),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY.LIST] });
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY.UNREAD_COUNT] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {

      queryClient.setQueryData([NOTIFICATION_QUERY_KEY.UNREAD_COUNT], (old: any) => {
        if (!old?.data) return { data: 0, success: true };
        return { ...old, data: 0 };
      });

      queryClient.setQueryData([NOTIFICATION_QUERY_KEY.LIST, { page: 0, size: 10 }], (old: any) => {
        if (!old?.data?.content) return old;
        return {
          ...old,
          data: {
            ...old.data,
            content: old.data.content.map((n: any) => ({
              ...n,
              isRead: true,
              readAt: new Date().toISOString(),
            })),
          },
        };
      });
    },
  });
};

export const useNotificationSSE = () => {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const accessToken = useAuthStore(state => state.accessToken);

  const connect = () => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    const token = accessToken || getCookie('accessToken') || undefined;

    try {
      const eventSource = notificationApi.createSSEConnection(token);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = event => {
        try {
          const notification: Notification = JSON.parse(event.data);
          queryClient.setQueryData<ApiResponse<NotificationListResponse>>(
            [NOTIFICATION_QUERY_KEY.LIST, { page: 0, size: 10 }],
            old => {
              if (!old?.data) return old;
              return {
                ...old,
                data: {
                  ...old.data,
                  content: [notification, ...old.data.content],
                },
              };
            },
          );

          queryClient.setQueryData([NOTIFICATION_QUERY_KEY.UNREAD_COUNT], (old: any) => {
            const current = old?.data ?? 0;
            return { success: true, data: current + 1 };
          });
        } catch (error) {
          logger.error('Error parsing SSE message:', error);
        }
      };

      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const notification: Notification = JSON.parse(event.data);
          queryClient.setQueryData<ApiResponse<NotificationListResponse>>(
            [NOTIFICATION_QUERY_KEY.LIST, { page: 0, size: 10 }],
            old => {
              if (!old?.data) return old;
              return {
                ...old,
                data: {
                  ...old.data,
                  content: [notification, ...old.data.content],
                },
              };
            },
          );
          queryClient.setQueryData([NOTIFICATION_QUERY_KEY.UNREAD_COUNT], (old: any) => {
            const current = old?.data ?? 0;
            return { success: true, data: current + 1 };
          });
        } catch (error) {
          logger.error('Error parsing SSE notification event:', error);
        }
      });

      eventSource.onerror = error => {
        logger.error('SSE connection error:', error);
        setIsConnected(false);
        eventSource.close();

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch (error) {
      logger.error('Error creating SSE connection:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return { isConnected, reconnect: connect, disconnect };
};
