import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

type FormActionsProps = {
  isSubmitting?: boolean;
}

export function FormActions({ isSubmitting: isSubmittingProp }: FormActionsProps) {
  const t = useTranslations('admin.role.create');
  const { reset, formState } = useFormContext();
  const isSubmitting = isSubmittingProp ?? formState.isSubmitting;

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
        {t('reset')}
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('creating')}
          </>
        ) : (
          t('create')
        )}
      </Button>
    </div>
  );
}
