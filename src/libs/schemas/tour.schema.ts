import { TourStatus } from '@/core/enum/tour.enum';
import { z } from 'zod';

export const createTourSchema = (t: (key: string) => string, isUpdate: boolean = false) =>
  z
    .object({
      image: z.string().min(1, { message: t('tourCreate.validation.imageRequired') }),
      title: z.string().min(1, { message: t('tourCreate.validation.titleRequired') }),
      location: z.array(z.string()).min(1, { message: t('tourCreate.validation.locationRequired') }),
      ethnic: z.array(z.string()).min(1, { message: t('tourCreate.validation.ethnicRequired') }),
      status: z.string().refine(
        value => {
          try {
            return Object.values(TourStatus).includes(value as TourStatus);
          } catch (error) {
            return !!value;
          }
        },
        { message: t('tourCreate.validation.statusInvalid') },
      ),
      pickupLocation: z.string().min(1, { message: t('tourCreate.validation.pickupLocationRequired') }),
      publishedDate: z.date({ required_error: t('tourCreate.validation.publishedDateRequired') }).refine(
        date => {
          if (isUpdate) return true;
          const currentDate = new Date();
          const minDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          return date >= minDate;
        },
        { message: t('tourCreate.validation.publishedDateMinWeek') },
      ),
      duration: z
        .number()
        .min(1, { message: t('tourCreate.validation.durationMin') })
        .max(30, { message: t('tourCreate.validation.durationMax') }),
      adultPrice: z.number().min(1, { message: t('tourCreate.validation.adultPriceMin') }),
      childPrice: z.number().min(1, { message: t('tourCreate.validation.childPriceMin') }),
      included: z.array(z.string()),
      excluded: z.array(z.string()),
      overview: z
        .string()
        .min(1, { message: t('tourCreate.validation.overviewRequired') })
        .max(1000, { message: t('tourCreate.validation.overviewMax') }),
      itinerary: z.array(
        z.object({
          title: z.string().min(1, { message: t('tourCreate.validation.itineraryTitleRequired') }),
          description: z.string().min(1, { message: t('tourCreate.validation.itineraryDescriptionRequired') }),
        }),
      ),
      availableDates: z
        .array(
          z.object({
            startDate: z.date({ required_error: t('tourCreate.validation.startDateRequired') }),

            maxSlots: z.number().min(1, { message: t('tourCreate.validation.maxSlotsMin') }),
          }),
        )
        .min(1, { message: t('tourCreate.validation.availableDatesRequired') }),
    })
    .refine(
      data => {

        if (isUpdate) return true;
        if (!data.publishedDate) return true;
        const currentDate = new Date();
        const minPublishedDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return data.publishedDate >= minPublishedDate;
      },
      {
        message: t('tourCreate.validation.publishedDateMinWeek'),
        path: ['publishedDate'],
      },
    )
    .refine(
      data => {
        if (isUpdate) return true;
        if (!data.publishedDate || !data.availableDates) return true;
        const minStartDate = new Date(data.publishedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        return data.availableDates.every(date => date.startDate >= minStartDate);
      },
      {
        message: t('tourCreate.validation.startDateAfterPublished'),
        path: ['availableDates'],
      },
    );

export type TourCreateFormValues = z.infer<ReturnType<typeof createTourSchema>>;
