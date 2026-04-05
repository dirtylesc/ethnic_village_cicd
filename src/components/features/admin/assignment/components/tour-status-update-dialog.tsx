'use client';

import { useState } from 'react';
import { TourAvailableDateStatus, TourAvailableDateStatusEnum } from '@/core/enum/tour.enum';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { AssignedAvailableDateResponse } from '@/types/tour-assignment.type';
import { useUpdateTourAvailableDateStatus } from '@/hooks/api/useTourAssignment';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type TourStatusUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: AssignedAvailableDateResponse | null;
};

export function TourStatusUpdateDialog({ open, onOpenChange, assignment }: TourStatusUpdateDialogProps) {
  const t = useTranslations('admin');
  const { toast } = useToast();
  const { mutateAsync: updateStatus, isPending } = useUpdateTourAvailableDateStatus();

  const [selectedStatus, setSelectedStatus] = useState<TourAvailableDateStatus | null>(null);

  if (!assignment) return null;

  const currentStatus = assignment.tourAvailableDate.status;

  const getAvailableStatuses = (): TourAvailableDateStatus[] => {
    if (currentStatus === TourAvailableDateStatus.AVAILABLE || currentStatus === TourAvailableDateStatus.FULLY_BOOKED) {
      return [TourAvailableDateStatus.ONGOING];
    } else if (currentStatus === TourAvailableDateStatus.ONGOING) {
      return [TourAvailableDateStatus.COMPLETED];
    }
    return [];
  };

  const availableStatuses = getAvailableStatuses();

  const handleSubmit = async () => {
    if (!selectedStatus) return;

    try {
      await updateStatus({
        tourAvailableDateId: assignment.tourAvailableDate.id,
        status: selectedStatus,
      });

      toast({
        title: t('tour.assigned_dates.status_updated_success'),
        description: t('tour.assigned_dates.status_updated_desc'),
        variant: 'default',
      });

      onOpenChange(false);
      setSelectedStatus(null);
    } catch (error) {
      toast({
        title: t('tour.assigned_dates.status_update_failed'),
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('tour.assigned_dates.update_status_title')}</DialogTitle>
          <DialogDescription>{assignment.tour.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{t('tour.assigned_dates.current_status')}:</span>
            <Badge variant={TourAvailableDateStatusEnum[currentStatus].variant}>
              {t(`available_date_status.${currentStatus}`)}
            </Badge>
          </div>

          {availableStatuses.length > 0 ? (
            <div className="space-y-3">
              <Label>{t('tour.assigned_dates.select_new_status')}</Label>
              <RadioGroup
                value={selectedStatus || undefined}
                onValueChange={value => setSelectedStatus(value as TourAvailableDateStatus)}
              >
                {availableStatuses.map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <RadioGroupItem value={status} id={status} />
                    <Label htmlFor={status} className="cursor-pointer">
                      <Badge variant={TourAvailableDateStatusEnum[status].variant}>
                        {t(`available_date_status.${status}`)}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{t('tour.assigned_dates.no_status_transition_available')}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {t('tour.assigned_dates.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedStatus || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('tour.assigned_dates.update_status')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
