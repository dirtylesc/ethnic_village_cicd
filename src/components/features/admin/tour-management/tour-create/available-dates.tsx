import { useMemo, useState } from 'react';
import { CalendarIcon, Edit, Plus, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { UseFormReturn, useWatch } from 'react-hook-form';

import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type AvailableDatesProps = {
  form: UseFormReturn<TourCreateFormValues>;
};

export default function AvailableDates({ form }: AvailableDatesProps) {
  const t = useTranslations();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [maxSlots, setMaxSlots] = useState<number>(10);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const duration = useWatch({ control: form.control, name: 'duration' }) || 3;
  const publishedDate = useWatch({ control: form.control, name: 'publishedDate' });
  const availableDates = form.watch('availableDates') || [];

  const minStartDate = useMemo(() => {
    if (!publishedDate) return new Date();
    return new Date(publishedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }, [publishedDate]);

  const calculateEndDate = (date: Date) => {
    return new Date(date.getTime() + (duration - 1) * 24 * 60 * 60 * 1000);
  };

  const checkConflict = (newStart: Date, excludeIndex?: number) => {
    const newEnd = calculateEndDate(newStart);
    return availableDates.some((existing, i) => {
      if (excludeIndex !== undefined && i === excludeIndex) return false;
      if (!existing.startDate) return false;
      const existingStart = new Date(existing.startDate);
      const existingEnd = calculateEndDate(existingStart);
      return newStart <= existingEnd && newEnd >= existingStart;
    });
  };

  const handleAddOrUpdate = () => {
    if (!startDate || maxSlots < 1) return;

    if (checkConflict(startDate, editIndex ?? undefined)) {
      toast({
        title: t('tourCreate.dateConflictWarning'),
        description: t('tourCreate.availableDatesConflictMessage'),
        variant: 'destructive',
      });
      return;
    }

    const currentDates = form.getValues('availableDates') || [];
    const newItem = { startDate, maxSlots } as any;

    if (editIndex !== null) {
      const updated = [...currentDates];
      updated[editIndex] = { ...updated[editIndex], startDate, maxSlots };
      form.setValue('availableDates', updated);
      setEditIndex(null);
    } else {
      form.setValue('availableDates', [newItem, ...currentDates]);
    }

    setStartDate(undefined);
    setMaxSlots(10);
    setIsPopoverOpen(false);
  };

  const handleEdit = (index: number) => {
    const item = availableDates[index];
    setStartDate(new Date(item.startDate));
    setMaxSlots(item.maxSlots);
    setEditIndex(index);
    setIsPopoverOpen(true);
  };

  const handleDelete = (index: number) => {
    const current = form.getValues('availableDates') || [];
    form.setValue(
      'availableDates',
      current.filter((_, i) => i !== index),
      { shouldValidate: false },
    );
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setEditIndex(null);
      setStartDate(undefined);
      setMaxSlots(10);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <FormLabel className="font-semibold">{t('tourCreate.availableDates')}</FormLabel>
        <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div>
                <FormLabel className="text-sm">{t('tourCreate.startDate')}</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className="mt-1 w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? startDate.toLocaleDateString('vi-VN') : t('tourCreate.chooseDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={date => {
                        setStartDate(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={date => date < minStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && (
                <div>
                  <FormLabel className="text-sm">{t('tourCreate.endDate')}</FormLabel>
                  <div className="mt-1 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {calculateEndDate(startDate).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              )}

              <div>
                <FormLabel className="text-sm">{t('tourCreate.maxSlots')}</FormLabel>
                <Input
                  type="number"
                  min={1}
                  value={maxSlots}
                  onChange={e => setMaxSlots(Math.max(1, Number(e.target.value)))}
                  className="mt-1"
                />
              </div>

              <Button type="button" onClick={handleAddOrUpdate} className="w-full" disabled={!startDate}>
                {editIndex !== null ? t('tourCreate.save') : t('tourCreate.add')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        {availableDates.map((item, index) => {
          const start = new Date(item.startDate);
          const end = calculateEndDate(start);
          return (
            <div key={index} className="flex items-center justify-between rounded border p-3">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {start.toLocaleDateString('vi-VN')} - {end.toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.maxSlots} {t('tourCreate.slots')}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(index)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(index)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
        {availableDates.length === 0 && (
          <div className="rounded border border-dashed p-4 text-center text-sm text-muted-foreground">
            {t('tourCreate.noAvailableDates')}
          </div>
        )}
      </div>
    </div>
  );
}
