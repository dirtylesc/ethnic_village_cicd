'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import logger from '@/libs/logger';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import SharedFormField, { SharedFormFieldProps } from '@/components/shared/form-field';

export type CardUpdateField = Omit<SharedFormFieldProps, 'name'> & {
  name: string;
  defaultValue: string;
};

type CardUpdateProps = {
  title: string;
  className?: string;
  formSchema: z.ZodObject<any>;
  fields: CardUpdateField[];
  footerOptions?: React.ReactNode;
  defaultIsUpdating?: boolean;
  onSubmit?: (data: any) => Promise<void>;
}

export default function CardUpdate({
  title,
  className,
  formSchema,
  fields = [],
  footerOptions,
  defaultIsUpdating = false,
  onSubmit,
}: CardUpdateProps) {
  type FormData = z.infer<typeof formSchema>;

  const hasAllRequiredFields = () => {
    return fields.every(field => {
      if (field.required) {
        return field.defaultValue && field.defaultValue.trim() !== '';
      }
      return true;
    });
  };

  const [isUpdating, setIsUpdating] = useState(defaultIsUpdating || !hasAllRequiredFields());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsUpdating(defaultIsUpdating || !hasAllRequiredFields());
  }, [defaultIsUpdating, fields]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, item) => {
      acc[item.name] = item.defaultValue;
      return acc;
    }, {} as FormData),
    mode: 'onBlur',
  });

  const handleChange = () => {
    setIsUpdating(true);
  };

  const handleCancel = () => {
    if (hasAllRequiredFields()) {
      form.reset();
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      if (onSubmit) {
        await onSubmit(data);
      } else {

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setSubmitResult({
        success: true,
        message: 'Form submitted successfully!',
      });

      setIsUpdating(false);
    } catch (error) {
      logger.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        message: 'An error occurred while submitting the form.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn(className, 'rounded-md')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 py-3">
        <CardTitle className="text-xl">{title}</CardTitle>
        {!isUpdating && (
          <Button variant="link" size="sm" onClick={handleChange}>
            Change
          </Button>
        )}
      </CardHeader>
      <Separator className="h-px w-full bg-gray-20" />
      <CardContent className="px-5 py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.name} className="flex flex-col gap-1">
                <SharedFormField {...field} defaultChildren={!isUpdating ? field.defaultChildren : undefined} />
                {isUpdating && form.formState.errors[field.name]?.message && (
                  <FormMessage>{form.formState.errors[field.name]?.message?.toString()}</FormMessage>
                )}
              </div>
            ))}
          </form>
        </Form>
      </CardContent>
      {isUpdating ? (
        <CardFooter className="flex justify-end gap-3">
          {hasAllRequiredFields() && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      ) : (
        footerOptions && (
          <CardFooter className={cn('flex justify-between rounded-b-md bg-gray-20 px-5 py-0')}>
            {footerOptions}
          </CardFooter>
        )
      )}
    </Card>
  );
}
