'use client';

import { useState } from 'react';
import { CheckCheck } from 'lucide-react';

import { useMarkAllAsRead, useMarkAsRead, useNotifications, useUnreadCount } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { NotificationItem } from './notification-item';

export function NotificationPage() {
  const [page, setPage] = useState(0);
  const size = 20;

  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData?.data || 0;

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    size,
  });

  const notifications = notificationsData?.data?.content || [];
  const totalPages = notificationsData?.data?.totalPages || 0;

  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Không có thông báo</div>
        ) : (
          <div className="space-y-1">
            {notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
            ))}
          </div>
        )}
      </ScrollArea>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
            Trước
          </Button>
          <span className="flex items-center px-4 text-sm">
            Trang {page + 1} / {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
