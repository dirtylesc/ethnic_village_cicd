import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/utils';
import dayjs from 'dayjs';
import { AlertTriangle, CalendarDays, Check, Clock, Loader2, UserCheck, Users, XCircle } from 'lucide-react';

import { EmployeeBasicResponse, EmployeeSelectedResponse } from '@/types/employee.type';
import { useAvailableEmployeesByDateRange } from '@/hooks/api/useEmployee';
import { useAssignSingleDate } from '@/hooks/api/useTourAssignment';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

type AvailableEmployeeSelectProps = {
  tourAvailableDateId: string;
  startDate: string;
  endDate: string;
  value: EmployeeSelectedResponse | null;
  onChange: (guide: EmployeeSelectedResponse | null) => void;
  placeholder?: string;
  className?: string;
  dateIndex?: number;
  showDateHeader?: boolean;
  bookedSlots?: number;
  maxSlots?: number;
  onSaveSuccess?: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function AvailableEmployeeSelect({
  tourAvailableDateId,
  startDate,
  endDate,
  value,
  onChange,
  placeholder = 'Chọn nhân viên',
  className,
  dateIndex,
  showDateHeader = false,
  bookedSlots = 0,
  maxSlots = 0,
  onSaveSuccess,
}: AvailableEmployeeSelectProps) {
  const [open, setOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [savedGuide, setSavedGuide] = useState<EmployeeSelectedResponse | null>(value);
  const [localValue, setLocalValue] = useState<EmployeeSelectedResponse | null>(value);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setLocalValue(value);
    setSavedGuide(value);
    if (value) {
      setSaveStatus('idle');
    }
  }, [value]);

  const assignSingleDate = useAssignSingleDate();
  const { toast } = useToast();

  const apiParams = useMemo(
    () =>
      open && startDate && endDate
        ? {
            startDate: dayjs(startDate).format('YYYY-MM-DD'),
            endDate: dayjs(endDate).format('YYYY-MM-DD'),
          }
        : undefined,
    [open, startDate, endDate],
  );

  const { data, isLoading } = useAvailableEmployeesByDateRange(apiParams);
  const employees: EmployeeBasicResponse[] = Array.isArray(data) ? data : [];

  const employeeOptions = useMemo(
    () =>
      employees
        .filter(e => e && e.id)
        .map((e: EmployeeBasicResponse) => ({
          id: String(e.id),
          name: e.personal ? `${e.personal.firstName} ${e.personal.lastName}` : e.email || `Nhân viên ${e.id}`,
        })),
    [employees],
  );

  const assignedGuideOption = useMemo(() => {
    if (!localValue || !localValue.id) return [];
    const isInEmployees = employees.some(emp => emp && emp.id && String(emp.id) === String(localValue.id));
    if (isInEmployees) return [];

    return [
      {
        id: String(localValue.id),
        name: localValue.personal
          ? `${localValue.personal.firstName} ${localValue.personal.lastName}`
          : localValue.email || `Nhân viên ${localValue.id}`,
      },
    ];
  }, [localValue, employees]);

  const allOptions = useMemo(
    () => [...employeeOptions, ...assignedGuideOption],
    [employeeOptions, assignedGuideOption],
  );

  const selectedId = useMemo(() => (localValue && localValue.id ? String(localValue.id) : ''), [localValue]);

  const handleAutoSave = useCallback(
    async (guide: EmployeeSelectedResponse) => {
      setSaveStatus('saving');
      setErrorMessage('');

      try {
        await assignSingleDate.mutateAsync({
          tourAvailableDateId,
          guideId: String(guide.id),
        });

        setSaveStatus('saved');
        setSavedGuide(guide);

        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);

        onSaveSuccess?.();
      } catch (error: any) {
        setSaveStatus('error');
        const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
        setErrorMessage(message);
        toast({ title: 'Lỗi phân công', description: message, variant: 'destructive' });

        setLocalValue(savedGuide);
      }
    },
    [tourAvailableDateId, assignSingleDate, onSaveSuccess, toast, savedGuide],
  );

  const handleChange = useCallback(
    (selectedGuideId: string) => {
      if (!selectedGuideId) {
        setLocalValue(null);
        onChange(null);
        return;
      }

      const allEmployees = localValue ? [...employees, localValue] : employees;
      const allValidEmployees = allEmployees.filter(emp => emp && emp.id);
      const selectedGuide = allValidEmployees.find(emp => String(emp.id) === selectedGuideId);

      if (selectedGuide) {
        setLocalValue(selectedGuide);
        onChange(selectedGuide);
        handleAutoSave(selectedGuide);
      }
    },
    [employees, localValue, onChange, handleAutoSave],
  );

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getGuideName = (guide: EmployeeSelectedResponse | null) => {
    if (!guide) return null;
    return guide.personal
      ? `${guide.personal.firstName} ${guide.personal.lastName}`
      : guide.email || `Nhân viên ${guide.id}`;
  };

  if (showDateHeader) {
    const isAssigned = !!savedGuide;
    const daysCount = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
    const slotsPercentage = maxSlots > 0 ? Math.round((bookedSlots / maxSlots) * 100) : 0;
    const isCapacityWarning = slotsPercentage >= 80;
    const isCapacityFull = bookedSlots >= maxSlots;

    return (
      <Card
        className={cn(
          'transition-all hover:shadow-md',
          isAssigned
            ? 'bg-primary/5 border-l-4 border-l-primary'
            : saveStatus === 'error'
              ? 'border-l-4 border-l-red-500 bg-red-50'
              : 'hover:border-l-primary/50 border-l-4 border-l-muted',
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className={cn('h-4 w-4', isAssigned ? 'text-primary' : 'text-muted-foreground')} />
                <span>
                  {dateIndex !== undefined && <span className="text-muted-foreground">Ngày {dateIndex + 1}: </span>}
                  {dayjs(startDate).format('DD/MM/YYYY')} - {dayjs(endDate).format('DD/MM/YYYY')}
                </span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Badge variant="outline" className="gap-1.5">
                  <Clock className="h-3 w-3" />
                  {daysCount} ngày
                </Badge>
                {maxSlots > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span
                      className={cn(
                        isCapacityWarning && 'font-medium text-orange-600',
                        isCapacityFull && 'font-medium text-red-600',
                      )}
                    >
                      {bookedSlots}/{maxSlots} chỗ
                    </span>
                    {slotsPercentage > 0 && <span className="text-muted-foreground/70">({slotsPercentage}%)</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && (
                <Badge variant="secondary" className="animate-pulse gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Đang lưu...
                </Badge>
              )}
              {saveStatus === 'saved' && (
                <Badge variant="default" className="gap-1.5 bg-green-600 duration-300 animate-in fade-in">
                  <Check className="h-3 w-3" />
                  Đã lưu
                </Badge>
              )}
              {saveStatus === 'error' && (
                <Badge variant="destructive" className="gap-1.5">
                  <XCircle className="h-3 w-3" />
                  Lỗi
                </Badge>
              )}
              {isAssigned && saveStatus === 'idle' && (
                <Badge variant="outline" className="border-primary/50 gap-1.5 text-primary">
                  <UserCheck className="h-3 w-3" />
                  Đã phân công
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Label className="mb-3 flex items-center gap-2 text-sm font-medium">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            Chọn nhân viên phụ trách
            {getStatusIcon() && <span className="ml-auto">{getStatusIcon()}</span>}
          </Label>
          <div className={cn('space-y-3', className)}>
            {isLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải danh sách nhân viên...</span>
              </div>
            )}

            <Select
              value={selectedId}
              onValueChange={handleChange}
              onOpenChange={setOpen}
              disabled={saveStatus === 'saving'}
            >
              <SelectTrigger
                className={cn(
                  'min-h-[44px] w-full transition-all',
                  isAssigned && 'border-primary/50 bg-primary/5',
                  saveStatus === 'saving' && 'cursor-wait opacity-70',
                  saveStatus === 'error' && 'border-red-500 bg-red-50',
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <SelectValue placeholder={placeholder} />
                  {saveStatus === 'saving' && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
                </div>
              </SelectTrigger>
              <SelectContent
                className="z-[100] max-h-[300px]"
                onCloseAutoFocus={e => e.preventDefault()}
                sideOffset={4}
              >
                {allOptions.length === 0 && !isLoading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Không có nhân viên khả dụng</div>
                ) : (
                  allOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center gap-2">
                        <span>{option.name}</span>
                        {option.id === selectedId && saveStatus === 'saved' && (
                          <Check className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 duration-200 animate-in slide-in-from-top-2">
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            {isCapacityWarning && (
              <div
                className={cn(
                  'flex items-start gap-2 rounded-lg border p-3 text-xs',
                  isCapacityFull
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-orange-200 bg-orange-50 text-orange-800',
                )}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-1">
                  {isCapacityFull ? 'Tour đã đủ số lượng khách.' : `Tour đã đạt ${slotsPercentage}% capacity.`}
                </div>
              </div>
            )}

            {savedGuide && saveStatus !== 'error' && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg p-2.5 text-sm transition-all',
                  saveStatus === 'saved' ? 'bg-green-100' : 'bg-primary/10',
                )}
              >
                <UserCheck className={cn('h-4 w-4', saveStatus === 'saved' ? 'text-green-600' : 'text-primary')} />
                <div className="flex-1">
                  <div className={cn('font-medium', saveStatus === 'saved' ? 'text-green-800' : 'text-primary')}>
                    {getGuideName(savedGuide)}
                  </div>
                </div>
                {saveStatus === 'saved' && <Check className="h-4 w-4 text-green-600 duration-200 animate-in zoom-in" />}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {isLoading && (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang tải danh sách nhân viên...
        </div>
      )}
      <Select value={selectedId} onValueChange={handleChange} onOpenChange={setOpen} disabled={saveStatus === 'saving'}>
        <SelectTrigger className={cn('min-h-[40px] flex-1', saveStatus === 'saving' && 'opacity-70')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-[100] max-h-[300px]" onCloseAutoFocus={e => e.preventDefault()} sideOffset={4}>
          {allOptions.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {localValue && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getStatusIcon()}
          <span>HDV: {getGuideName(localValue)}</span>
        </div>
      )}
    </div>
  );
}
