'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteConstant } from '@/core/constants/route';
import { TourStatusEnum } from '@/core/enum/tour.enum';
import { currencyToNumber, formatCurrency } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { TourCreateRequest } from '@/types/tour.type';
import { createTourSchema, TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useFetchEthnics, useFetchLocations } from '@/hooks/api/useMetaData';
import { useAdminTourDetail, useAdminUpdateTour } from '@/hooks/api/useTour';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/shared/multiple-select';

import AvailableDates from '../tour-create/available-dates';
import InExService from '../tour-create/in-ex-service';
import TourItinerary from '../tour-create/tour-itinerary';

type TourEditContentProps = {
  tourId: string;
};

const OVERVIEW_MAX_LENGTH = 1000;

export default function TourEditContent({ tourId }: TourEditContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: tourResponse, isLoading } = useAdminTourDetail(tourId);
  const tourData = tourResponse?.data;

  const { mutate: updateTour } = useAdminUpdateTour();
  const { data: ethnics } = useFetchEthnics();
  const { data: locations } = useFetchLocations();

  const defaultFormValues: TourCreateFormValues = {
    image: '',
    title: '',
    status: TourStatusEnum.DRAFT.value,
    duration: 3,
    itinerary: [],
    ethnic: [],
    location: [],
    included: [],
    excluded: [],
    availableDates: [],
    overview: '',
    adultPrice: 0,
    childPrice: 0,
    pickupLocation: '',
    publishedDate: new Date(),
  };

  const form = useForm<TourCreateFormValues>({
    resolver: zodResolver(createTourSchema((key: string) => t.raw(key as any), true)),
    defaultValues: defaultFormValues,
  });

  const hasResetRef = useRef(false);

  useEffect(() => {
    if (tourData && ethnics && locations && !hasResetRef.current) {
      hasResetRef.current = true;
      const services = tourData.tourServices || tourData.services || [];

      form.reset({
        title: tourData.title || '',
        image: tourData.imageUrl || '',
        overview: tourData.overview || '',
        status: tourData.status || TourStatusEnum.DRAFT.value,
        duration: tourData.duration || 1,
        pickupLocation: tourData.pickUpLocation?.id ? String(tourData.pickUpLocation.id) : '',
        adultPrice: tourData.adultPrice || 0,
        childPrice: tourData.childPrice || 0,
        itinerary:
          Array.isArray(tourData.timeline) && tourData.timeline.length > 0
            ? tourData.timeline.map((t: any) => ({
                title: t.title || `Ngày ${t.day || ''}`,
                description:
                  t.description || t.activities?.map((a: any) => `${a.time}: ${a.description}`).join('\n') || '',
              }))
            : [],
        ethnic: tourData.ethnics?.map(e => String(e.id)) || [],
        location: tourData.locations?.map(l => String(l.id)) || [],
        included: services.filter(s => s.included === true).map(s => String(s.id)) || [],
        excluded: services.filter(s => s.included === false).map(s => String(s.id)) || [],
        availableDates:
          (tourData.availableDates?.map(d => ({
            id: d.id,
            startDate: new Date(d.startDate),
            maxSlots: d.maxSlots,
            assignedEmployees: [],
          })) as any) || [],
        publishedDate: tourData.publishedAt ? new Date(tourData.publishedAt) : new Date(),
      });
    }
  }, [tourData, ethnics, locations, form]);

  const imageUrl = form.watch('image');
  const overviewValue = form.watch('overview') || '';

  const onSubmit = async (data: TourCreateFormValues) => {
    if (!data) return;
    setIsSubmitting(true);

    const duration = data.duration;

    const calculateEndDate = (startDate: Date, duration: number) => {
      const end = new Date(startDate);
      end.setDate(end.getDate() + (duration - 1));
      return end;
    };

    const payload: Partial<TourCreateRequest> = {
      title: data.title,
      imageUrl: data.image,
      overview: data.overview,
      status: data.status,
      duration,
      pickUpLocationId: data.pickupLocation,
      adultPrice: data.adultPrice,
      childPrice: data.childPrice,
      timeline: data.itinerary,
      ethnicIds: data.ethnic,
      locationIds: data.location,
      tourIncludedServices: data.included,
      tourExcludedServices: data.excluded,
      availableDates: data.availableDates.map((date: any) => ({
        id: date.id,
        startDate: date.startDate,
        endDate: calculateEndDate(date.startDate, duration),
        maxSlots: date.maxSlots,
      })),
      publishedDate: data.publishedDate,
    };

    updateTour(
      { id: tourId, data: payload },
      {
        onSuccess: data => {
          setIsSubmitting(false);
          if (!data) return;
          toast({
            title: t('tour.update.success' as any) || 'Cập nhật tour thành công',
            variant: 'default',
          });
          router.push(RouteConstant.admin_tour);
        },
        onError: error => {
          setIsSubmitting(false);
          toast({
            title: error.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  const onError = (errors: any) => {
    toast({
      title: 'Vui lòng kiểm tra lại thông tin',
      description: Object.keys(errors).join(', '),
      variant: 'destructive',
    });
  };

  return (
    <div className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.image')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="https://..."
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value)}
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploading(true);
                            const reader = new FileReader();
                            reader.onload = () => {
                              const result = reader.result as string;
                              form.setValue('image', result, { shouldValidate: true });
                              setUploading(false);
                            };
                            reader.onerror = () => setUploading(false);
                            reader.readAsDataURL(file);
                          }}
                        />
                        {uploading && (
                          <span className="text-xs text-muted-foreground">
                            {t('uploading' as any) || 'Uploading...'}
                          </span>
                        )}
                      </div>
                      {field.value && (
                        <div className="flex flex-col items-start gap-2">
                          <img
                            src={field.value}
                            alt="preview"
                            className="aspect-video w-full max-w-[400px] rounded-md border object-cover"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => form.setValue('image', '', { shouldValidate: true })}
                          >
                            {t('clear_image' as any) || 'Clear'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.title')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên tour" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.location')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={(locations ?? []).map(loc => ({
                        id: String(loc.id),
                        name: loc.city,
                        province: loc.province,
                      }))}
                      onValueChange={values => field.onChange(values)}
                      value={field.value}
                      placeholder={t('tourCreate.selectLocation')}
                      renderOption={option => (
                        <div className="flex flex-col">
                          <div className="flex gap-2">
                            <span className="text-sm font-semibold">{option.name}</span>
                            <Badge variant="outline" className="h-5 text-[10px]">
                              {option.province}
                            </Badge>
                          </div>
                        </div>
                      )}
                      maxCount={5}
                      animation={2}
                      variant="secondary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ethnic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.ethnic')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <MultiSelect
                    options={(ethnics ?? []).map(e => ({ ...e, id: String(e.id) }))}
                    onValueChange={values => field.onChange(values)}
                    value={field.value}
                    placeholder={t('tourCreate.selectEthnic')}
                    variant="inverted"
                    animation={2}
                    maxCount={3}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.duration')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        placeholder="Nhập số ngày"
                      />
                      {typeof field.value === 'number' && field.value > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {field.value} ngày {field.value - 1} đêm
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {t('tourCreate.status')}
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <select
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="" disabled>
                          Chọn trạng thái
                        </option>
                        {Object.values(TourStatusEnum).map(({ value }) => (
                          <option key={value} value={value}>
                            {t(`admin.status.${value}` as any) || value}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-[10px] font-semibold">
                      {t('tourCreate.publishedDate')}
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          {field.value ? field.value.toLocaleDateString('vi-VN') : t('tourCreate.chooseDate')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pickupLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.pickupLocation')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="" disabled>
                        {t('tourCreate.selectPickupLocation')}
                      </option>
                      {(locations ?? []).map(option => (
                        <option key={option.id} value={option.id.toString()}>
                          {option.city} - {option.province}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="adultPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {t('tourCreate.adultPrice')}
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        {...field}
                        onChange={e => {
                          const numericValue = currencyToNumber(e.target.value);
                          field.onChange(numericValue);
                        }}
                        value={formatCurrency(field.value || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="childPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      {t('tourCreate.childPrice')}
                      <span className="text-destructive"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        {...field}
                        onChange={e => {
                          const numericValue = currencyToNumber(e.target.value);
                          field.onChange(numericValue);
                        }}
                        value={formatCurrency(field.value || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <AvailableDates form={form} />
            <InExService form={form} />
            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    {t('tourCreate.overview')}
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px]"
                      placeholder="Mô tả tổng quan về tour..."
                      maxLength={OVERVIEW_MAX_LENGTH}
                    />
                  </FormControl>
                  <div className="flex justify-between text-sm">
                    <FormMessage />
                    <span
                      className={`${overviewValue.length > OVERVIEW_MAX_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}
                    >
                      {overviewValue.length}/{OVERVIEW_MAX_LENGTH}
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <TourItinerary form={form} />
          </div>

          <div className="col-span-2 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              {t('Common.button.cancel' as any) || 'Hủy'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Đang lưu...' : t('Common.button.save' as any) || 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
