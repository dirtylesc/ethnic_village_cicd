import React, { useEffect, useState } from 'react';
import { useTourAssignmentStore } from '@/stores/useTourAssignmentStore';
import { Calendar, CheckCircle2, Users, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import type { EmployeeBasicResponse } from '@/types/employee.type';
import { Tour } from '@/types/tour.type';
import { useAssignedEmployeesByDates } from '@/hooks/api/useEmployee';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { AvailableEmployeeSelect } from './available-employee-select';

type TourAssignmentDialogProps = {
  tour?: Tour;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TourAssignmentDialog({ tour, open, onOpenChange }: TourAssignmentDialogProps) {
  const tourId = tour?.id ? String(tour.id) : null;
  const [fetchKey, setFetchKey] = useState(0);

  const { setActiveTourId, setTourAssignments, clearTourAssignments } = useTourAssignmentStore();

  useEffect(() => {
    if (open && tourId) {
      setActiveTourId(tourId);
      setFetchKey(prev => prev + 1);
    }
  }, [open, tourId, setActiveTourId]);

  useEffect(() => {
    if (!open && tourId) {
      clearTourAssignments(tourId);
    }
  }, [open, tourId, clearTourAssignments]);

  const assignedGuideByDate = useTourAssignmentStore(
    useShallow(state => (tourId ? state.tourAssignments[tourId] || {} : {})),
  ) as { [dateId: string]: EmployeeBasicResponse | null };

  const availableDateIds = React.useMemo(
    () => tour?.availableDates?.map(date => String(date.id)) || [],
    [tour?.availableDates],
  );

  const shouldFetchData = open && availableDateIds.length > 0 && tourId;

  const {
    data: assignedEmployeesData,
    isLoading: isLoadingAssignedEmployees,
    error: assignedEmployeesError,
    refetch,
  } = useAssignedEmployeesByDates(shouldFetchData ? { availableDateIds } : undefined, {
    enabled: !!shouldFetchData,
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (shouldFetchData && fetchKey > 0) {
      refetch();
    }
  }, [fetchKey, shouldFetchData, refetch]);

  useEffect(() => {
    if (assignedEmployeesData?.assignedEmployeesByDate && tourId && open) {
      const convertedAssignments: { [dateId: string]: EmployeeBasicResponse | null } = {};
      Object.entries(assignedEmployeesData.assignedEmployeesByDate).forEach(([dateId, guides]) => {
        convertedAssignments[dateId] = Array.isArray(guides) && guides.length > 0 ? guides[0] : null;
      });
      setTourAssignments(tourId, convertedAssignments);
    }
  }, [assignedEmployeesData, setTourAssignments, tourId, open]);

  const totalAssignedGuides = React.useMemo(() => {
    return Object.values(assignedGuideByDate || {}).filter(guide => guide !== null).length;
  }, [assignedGuideByDate]);

  const handleSaveSuccess = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] max-w-5xl flex-col p-0"
        onOpenAutoFocus={e => e.preventDefault()}
        onInteractOutside={e => {
          const target = e.target as HTMLElement;
          if (target.closest('[role="listbox"]')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex-shrink-0 space-y-3 border-b bg-muted/30 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                Phân công người dẫn tour
              </DialogTitle>
              {tour && (
                <DialogDescription className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                  <Badge variant="secondary" className="gap-1.5 font-medium">
                    <Calendar className="h-3 w-3" />
                    {tour.title}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{tour.availableDates?.length || 0} ngày khả dụng</span>
                  {!isLoadingAssignedEmployees && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="flex items-center gap-1.5 font-medium text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {totalAssignedGuides}/{tour.availableDates?.length || 0} ngày đã có HDV
                      </span>
                    </>
                  )}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-4 px-6 py-6">
            {assignedEmployeesError ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-16 text-center">
                <div className="mb-4 rounded-full bg-destructive/10 p-4">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-destructive">Lỗi tải dữ liệu</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Không thể tải danh sách nhân viên đã phân công. Vui lòng thử lại sau.
                </p>
              </div>
            ) : isLoadingAssignedEmployees ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium text-muted-foreground">
                  Đang tải danh sách nhân viên đã phân công...
                </p>
              </div>
            ) : tour && tour.availableDates && tour.availableDates.length > 0 ? (
              <div className="grid gap-4">
                {tour.availableDates.map((date, index) => {
                  const bookedSlots =
                    date.bookedPersonCounts?.reduce(
                      (total, booking) => total + (booking.adult || 0) + (booking.child || 0),
                      0,
                    ) || 0;
                  const currentGuide = assignedGuideByDate[String(date.id)] || null;
                  return (
                    <AvailableEmployeeSelect
                      key={String(date.id)}
                      tourAvailableDateId={String(date.id)}
                      startDate={date.startDate}
                      endDate={date.endDate}
                      value={currentGuide}
                      onChange={() => {}}
                      placeholder="Tìm và chọn nhân viên..."
                      dateIndex={index}
                      showDateHeader={true}
                      bookedSlots={bookedSlots}
                      maxSlots={date.maxSlots || 0}
                      onSaveSuccess={handleSaveSuccess}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 py-16 text-center">
                <Users className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <h3 className="mb-2 text-lg font-semibold text-muted-foreground">Không có ngày khả dụng</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Tour này chưa có ngày khả dụng nào để phân công nhân viên. Vui lòng thêm ngày khả dụng trước.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
