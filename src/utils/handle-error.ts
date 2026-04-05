import { isRedirectError } from 'next/dist/client/components/redirect';
import { z } from 'zod';

import { ApiResponse } from '@/types/api.type';

export function getErrorMessage(err: unknown) {
  const unknownError = 'An unexpected error occurred';

  if (err instanceof z.ZodError) {
    const errors = err.errors.map(error => error.message);
    return errors.join(', ');
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (isRedirectError(err)) {
    return 'Redirecting...';
  }

  if (typeof err === 'string') {
    return err;
  }

  return unknownError;
}

type ToastFunction = {
  (props: { title: string; variant?: 'default' | 'destructive' }): void;
}

export const handleError = (error: any, toast: ToastFunction) => {
  if (error.message) {
    toast({
      title: error.message,
      variant: 'destructive',
    });
    return;
  }

  if (error.error) {
    toast({
      title: error.error,
      variant: 'destructive',
    });
    return;
  }

  if (error.response?.data) {
    const response = error.response.data as ApiResponse<any>;
    toast({
      title: response.message || 'Something went wrong',
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Something went wrong',
    variant: 'destructive',
  });
};
