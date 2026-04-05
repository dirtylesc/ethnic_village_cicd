'use client';

import { format } from 'date-fns';
import { Clock, History, User, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAssignmentHistory } from '@/hooks/api/useTourAssignment';
import type { AssignmentHistoryRequest } from '@/types/tour-assignment.type';

type AssignmentHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AssignmentHistoryRequest | null;
}

export function AssignmentHistoryDialog({ open, onOpenChange, request }: AssignmentHistoryDialogProps) {
  const t = useTranslations('admin');

  const { data, isLoading } = useAssignmentHistory(request || {}, {
    enabled: open && request !== null,
  });

  const historyList = data?.data || [];

  const getActionLabel = (history: typeof historyList[0]) => {
    if (history.previousGuide && history.newGuide) {
      return 'Đã thay đổi guide';
    }
    if (history.newGuide && !history.previousGuide) {
      return 'Đã assign guide';
    }
    if (history.previousGuide && !history.newGuide) {
      return 'Đã xóa assignment';
    }
    return 'Thay đổi';
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'secondary';
    if (status === 'ASSIGNED') return 'default';
    if (status === 'REMOVED') return 'destructive';
    return 'secondary';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử phân công
          </DialogTitle>
          <DialogDescription>Xem tất cả các thay đổi của assignment này</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[600px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Chưa có lịch sử thay đổi</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyList.map((history, index) => (
                <div key={history.id} className="relative">
                  {index < historyList.length - 1 && (
                    <div className="absolute left-4 top-8 h-full w-0.5 bg-border" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2 rounded-lg border bg-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{getActionLabel(history)}</span>
                            {history.previousStatus && history.newStatus && (
                              <>
                                <Badge variant={getStatusBadgeVariant(history.previousStatus)} className="text-xs">
                                  {history.previousStatus}
                                </Badge>
                                <span className="text-xs text-muted-foreground">→</span>
                                <Badge variant={getStatusBadgeVariant(history.newStatus)} className="text-xs">
                                  {history.newStatus}
                                </Badge>
                              </>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(history.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                            {history.changedByName && (
                              <>
                                <span>•</span>
                                <User className="h-3 w-3" />
                                <span>{history.changedByName}</span>
                                {history.changedByEmail && (
                                  <span className="text-muted-foreground/70"> ({history.changedByEmail})</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {(history.previousGuide || history.newGuide) && (
                        <>
                          <Separator />
                          <div className="space-y-2 text-xs">
                            {history.previousGuide && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Từ:</span>
                                <span className="font-medium">
                                  {history.previousGuide.personal
                                    ? `${history.previousGuide.personal.firstName} ${history.previousGuide.personal.lastName}`
                                    : history.previousGuide.email}
                                </span>
                              </div>
                            )}
                            {history.newGuide && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Đến:</span>
                                <span className="font-medium">
                                  {history.newGuide.personal
                                    ? `${history.newGuide.personal.firstName} ${history.newGuide.personal.lastName}`
                                    : history.newGuide.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {history.changeReason && (
                        <>
                          <Separator />
                          <div className="text-xs">
                            <span className="text-muted-foreground">Lý do: </span>
                            <span>{history.changeReason}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
