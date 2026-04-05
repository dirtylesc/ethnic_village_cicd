'use client';

import { useNotificationSSE, useUnreadCount } from '@/hooks/useNotification';

import { NotificationDropdown } from './notification-dropdown';

export function NotificationBell() {
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data || 0;
  useNotificationSSE();

  return <NotificationDropdown />;
}
