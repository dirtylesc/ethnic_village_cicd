import { cn } from '@/utils/classnames';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';

import { Notification } from '@/types/notification.type';

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const meta = notification.data || {};
  const tourTitle = meta.tourTitle as string | undefined;
  const startDate = meta.startDate as string | undefined;
  const endDate = meta.endDate as string | undefined;
  const actor = (meta.assignedBy || meta.updatedBy || meta.removedBy) as string | undefined;

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent/70',
        !notification.isRead && 'bg-accent/60',
      )}
      onClick={handleClick}
    >
      <div className="mt-1">
        {notification.isRead ? (
          <Circle className="h-4 w-4 text-muted-foreground" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className={cn('text-sm font-semibold', !notification.isRead && 'text-foreground')}>{notification.title}</p>
        {tourTitle && (
          <p className="line-clamp-2 text-sm text-foreground/80">
            {tourTitle}
            {startDate && endDate ? ` • ${startDate} - ${endDate}` : ''}
          </p>
        )}
        {actor && <p className="text-xs text-muted-foreground">Người giao/ cập nhật: {actor}</p>}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
        </div>
      </div>
    </button>
  );
}
