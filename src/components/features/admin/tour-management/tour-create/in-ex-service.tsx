import { TourServiceInfoType } from '@/core/enum/tour-service-info.enum';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

import { ServiceInfoBasic } from '@/types/service-info.type';
import { TourCreateFormValues } from '@/libs/schemas/tour.schema';
import { useServiceInfoList } from '@/hooks/api/useServiceInfo';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/shared/multiple-select';

export type ServiceWithType = ServiceInfoBasic & { type: TourServiceInfoType };

type InExServiceProps = {
  form: UseFormReturn<TourCreateFormValues>;
};

export default function InExService({ form }: InExServiceProps) {
  const { data: serviceInfoList = [], isLoading, error } = useServiceInfoList();
  const t = useTranslations();

  const includedValue = form.watch('included') || [];
  const excludedValue = form.watch('excluded') || [];

  return (
    <>
      
      {isLoading && <div className="text-sm text-gray-500">Loading services...</div>}
      {error && <div className="text-sm text-red-500">Error loading services: {error.message}</div>}
      {!isLoading && serviceInfoList.length === 0 && <div className="text-sm text-yellow-600">No services found</div>}

      <FormField
        control={form.control}
        name="included"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.included')} ({serviceInfoList.length} services available)
            </FormLabel>
            <FormControl>
              <MultiSelect
                options={serviceInfoList
                  .filter(service => !excludedValue.includes(service.id))
                  .map(service => ({
                    id: String(service.id),
                    name: service.name,
                  }))}
                onValueChange={values => {
                  field.onChange(values);
                }}
                value={field.value || []}
                placeholder={t('tourCreate.included')}
                variant="inverted"
                animation={2}
                maxCount={3}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excluded"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">
              {t('tourCreate.excluded')} ({serviceInfoList.length} services available)
            </FormLabel>
            <FormControl>
              <MultiSelect
                options={serviceInfoList
                  .filter(service => !includedValue.includes(service.id))
                  .map(service => ({
                    id: String(service.id),
                    name: service.name,
                  }))}
                onValueChange={values => {
                  field.onChange(values);
                }}
                value={field.value || []}
                placeholder={t('tourCreate.excluded')}
                variant="destructive"
                animation={2}
                maxCount={3}
                disabled={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
