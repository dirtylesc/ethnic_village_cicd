'use client';

import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';

import { useMarkAllAsRead, useMarkAsRead, useNotifications, useUnreadCount } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

import { NotificationItem } from './notification-item';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data || 0;

  const { data: notificationsData, isLoading } = useNotifications({
    page: 0,
    size: 10,

  });

  const notifications = notificationsData?.data?.content || [];
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-semibold leading-none text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="font-semibold">Thông báo</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-1 h-3 w-3" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Không có thông báo</div>
          ) : (
            <div>
              {notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
