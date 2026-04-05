'use client';

import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/utils/classnames';
import { useCalendarAssignments } from '@/hooks/api/useTourAssignment';
import type { CalendarAssignmentResponse } from '@/types/tour-assignment.type';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function AssignmentCalendarView() {
  const t = useTranslations('admin');
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const isAdmin = user?.roles?.some(role => {
    const normalizedRole = role?.toUpperCase().replace(/^ROLE_/, '');
    return normalizedRole === 'ADMIN';
  }) ?? false;

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

  const { data, isLoading } = useCalendarAssignments({
    startDate: format(monthStart, 'yyyy-MM-dd'),
    endDate: format(monthEnd, 'yyyy-MM-dd'),
  });

  const assignments = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  const assignmentsByDate = useMemo(() => {
    const map = new Map<string, CalendarAssignmentResponse[]>();
    assignments.forEach(assignment => {
      const startDate = parseISO(assignment.startDate);
      const endDate = parseISO(assignment.endDate);
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(assignment);
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    });
    return map;
  }, [assignments]);

  const selectedDateAssignments = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return assignmentsByDate.get(dateKey) || [];
  }, [selectedDate, assignmentsByDate]);

  const modifiers = useMemo(() => {
    return {
      hasAssignment: (date: Date) => {
        const dateKey = format(date, 'yyyy-MM-dd');
        return assignmentsByDate.has(dateKey);
      },
    };
  }, [assignmentsByDate]);

  const modifiersClassNames = useMemo(() => {
    return {
      hasAssignment: 'bg-primary/10 text-primary font-medium hover:bg-primary/20',
    };
  }, []);

  const handlePreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg font-semibold">
                    {format(selectedMonth, 'MMMM yyyy')}
                  </CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    {assignments.length} {t('tour.assigned_dates.assignments_this_month')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-7 w-7">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-7 w-7">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 items-start justify-center pt-0">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center py-12">
                <div className="text-sm text-muted-foreground">Đang tải...</div>
              </div>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="w-full"
              />
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader className="pb-3">
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold">
                {selectedDate
                  ? format(selectedDate, 'EEEE, d MMMM yyyy')
                  : t('tour.assigned_dates.select_date')}
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                {selectedDate
                  ? selectedDateAssignments.length > 0
                    ? `${selectedDateAssignments.length} ${t('tour.assigned_dates.assignments')}`
                    : t('tour.assigned_dates.no_assignments')
                  : t('tour.assigned_dates.select_date_to_view')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col pt-0">
            {selectedDate ? (
              selectedDateAssignments.length > 0 ? (
                <ScrollArea className="flex-1">
                  <div className="space-y-2.5 pr-4">
                    {selectedDateAssignments.map((assignment, index) => (
                      <div key={assignment.assignmentId || index} className="rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm">
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm leading-snug line-clamp-2">
                                {assignment.tourTitle}
                              </h4>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 shrink-0" />
                                  <span>
                                    {format(parseISO(assignment.startDate), 'dd/MM')} -{' '}
                                    {format(parseISO(assignment.endDate), 'dd/MM/yyyy')}
                                  </span>
                                </div>
                                {assignment.maxSlots > 0 && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span>
                                      {assignment.bookedSlots || 0}/{assignment.maxSlots}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant={assignment.status === 'AVAILABLE' ? 'default' : 'secondary'} 
                              className="shrink-0 text-xs"
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                          {isAdmin && assignment.guideName && (
                            <>
                              <Separator className="my-2" />
                              <div className="flex items-center gap-1.5 text-xs">
                                <User className="h-3 w-3 shrink-0 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {t('tour.assigned_dates.guide')}:
                                </span>
                                <span className="font-medium">{assignment.guideName}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('tour.assigned_dates.no_assignments_on_date')}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('tour.assigned_dates.select_date_to_view')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
